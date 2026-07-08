import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { spawnSync } from "child_process";
import { parseContentFrontmatter } from "../lib/frontmatter";
import {
  BLOG_INDEX_PATH,
  COMPILED_MDX_CACHE_VERSION,
  CONTENT_CACHE_DIR,
  SERIES_INDEX_FORMAT_VERSION,
  SERIES_INDEX_PATH,
  getBlogCompiledMdxCachePath,
  getSeriesCompiledMdxCachePath,
  type BlogIndexData,
  type BlogIndexEntry,
  type SeriesIndexData,
  type SeriesIndexEntry,
  type SeriesIndexPartEntry,
} from "../lib/content-index";
import {
  buildCompiledMdxCacheEntry,
  ensureCompiledMdxCacheDirectory,
} from "../lib/compiled-mdx-cache";
import {
  SERIES_SECTIONS_PATH,
  getSeriesContentDirectory,
  getSeriesDomainManifestPaths,
  loadAggregatedSeriesManifest,
} from "../lib/series-manifest";
import { toggleContentRoutePages } from "./content-route-pages";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");
const SERIES_DIR = path.join(process.cwd(), "content", "series");
const EMBEDDINGS_FILE = path.join(CONTENT_CACHE_DIR, "embeddings.json");
const ASSETS_INDEX_META_FILE = path.join(CONTENT_CACHE_DIR, "assets-index-meta.json");
const API_DIR = path.join(process.cwd(), "app", "api");
const ASSETS_DIR = path.join(process.cwd(), "public", "assets");
const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

interface EmbeddingCacheEntry {
  fingerprint: string;
  contentHash: string;
  vector: number[];
}

interface BlogSearchDocument {
  id: string;
  title: string;
  tags: string[];
  description: string;
}

interface AssetIndexEntry {
  name: string;
  url: string;
  category: string;
  size: number;
  lastModified: number;
}

interface AssetIndexMetaEntry {
  url: string;
  size: number;
  fingerprint: string;
  lastModified: number;
}

interface SeriesFrontmatter {
  title?: string;
  date?: string | Date;
  tags?: string[];
  description?: string;
  series?: string;
  seriesTitle?: string;
  order?: number | string;
  partTitle?: string;
}

function hashContent(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function calculateContentStats(rawContent: string) {
  const cleanText = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  const charCount = cleanText.length;
  const words = cleanText.trim().split(/\s+/);
  const wordCount = words.length === 1 && words[0] === "" ? 0 : words.length;
  const readingTime = Math.ceil(wordCount / 200);
  return { charCount, wordCount, readingTime };
}

function fingerprintFromStat(stat: { size: number; mtimeMs: number }) {
  return `${stat.size}:${Math.trunc(stat.mtimeMs)}`;
}

interface GitContentState {
  available: boolean;
  trackedFingerprints: Map<string, string>;
  dirtyPaths: Set<string>;
}

let gitContentStateCache: GitContentState | null = null;

function toRepoRelativePath(filePath: string) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function loadGitContentState(): GitContentState {
  if (gitContentStateCache) {
    return gitContentStateCache;
  }

  const pathspecs = ["content/blogs", "content/series", "public/assets"];
  const trackedFingerprints = new Map<string, string>();
  const dirtyPaths = new Set<string>();

  const trackedResult = spawnSync("git", ["ls-files", "-s", "-z", "--", ...pathspecs], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  const statusResult = spawnSync(
    "git",
    ["status", "--porcelain=v1", "--no-renames", "-z", "--untracked-files=all", "--", ...pathspecs],
    {
      cwd: process.cwd(),
      encoding: "utf8",
    },
  );

  if (trackedResult.status !== 0 || statusResult.status !== 0) {
    gitContentStateCache = {
      available: false,
      trackedFingerprints,
      dirtyPaths,
    };
    return gitContentStateCache;
  }

  for (const record of trackedResult.stdout.split("\0")) {
    if (!record) {
      continue;
    }

    const match = record.match(/^\d+\s+([0-9a-f]+)\s+\d+\t(.+)$/);
    if (!match) {
      continue;
    }

    trackedFingerprints.set(match[2], `git:${match[1]}`);
  }

  for (const record of statusResult.stdout.split("\0")) {
    if (!record) {
      continue;
    }

    const relativePath = record.slice(3);
    if (relativePath) {
      dirtyPaths.add(relativePath);
    }
  }

  gitContentStateCache = {
    available: true,
    trackedFingerprints,
    dirtyPaths,
  };

  return gitContentStateCache;
}

function getContentFingerprint(filePath: string, stat: { size: number; mtimeMs: number }) {
  const relativePath = toRepoRelativePath(filePath);
  const gitState = loadGitContentState();

  if (gitState.available && !gitState.dirtyPaths.has(relativePath)) {
    const fingerprint = gitState.trackedFingerprints.get(relativePath);
    if (fingerprint) {
      return fingerprint;
    }
  }

  return `fs:${fingerprintFromStat(stat)}`;
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function writeJsonIfChanged(filePath: string, value: unknown) {
  const nextRaw = JSON.stringify(value);

  try {
    const currentRaw = await fs.readFile(filePath, "utf8");
    if (currentRaw === nextRaw) {
      return false;
    }
  } catch {
    // File does not exist yet.
  }

  await fs.writeFile(filePath, nextRaw);
  return true;
}

function normalizeDate(value: SeriesFrontmatter["date"]) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return String(value);
}

function toTitleCase(input: string) {
  return input
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function extractOrder(fileSlug: string, frontmatterOrder?: number | string) {
  if (typeof frontmatterOrder === "number" && Number.isFinite(frontmatterOrder)) {
    return frontmatterOrder;
  }

  if (typeof frontmatterOrder === "string") {
    const parsed = Number(frontmatterOrder);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  const partMatch = fileSlug.match(/part[-_]?0*(\d+)/i);
  if (partMatch) {
    return Number(partMatch[1]);
  }

  const numberMatch = fileSlug.match(/(\d+)/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }

  return Number.MAX_SAFE_INTEGER;
}

function inferPublicSeriesSlug(directorySlug: string, fileSlug: string) {
  const prefix = fileSlug.split("-part-")[0]?.trim().replace(/[-_]+$/, "");
  return prefix || directorySlug;
}

function resolvePublicSeriesSlug(
  directorySlug: string,
  fileSlug: string,
  frontmatterSeries: string | undefined,
  manifestSlugs: Set<string>,
) {
  const inferredSeriesSlug = inferPublicSeriesSlug(directorySlug, fileSlug);

  if (manifestSlugs.has(inferredSeriesSlug)) {
    return inferredSeriesSlug;
  }

  if (frontmatterSeries && manifestSlugs.has(frontmatterSeries)) {
    return frontmatterSeries;
  }

  return frontmatterSeries || inferredSeriesSlug;
}

function inferSeriesTitle(seriesSlug: string, fileNames: string[]) {
  const commonPrefix = fileNames[0]
    ?.split("-part-")[0]
    ?.replace(/[-_]+/g, " ")
    .trim();

  if (commonPrefix) {
    return commonPrefix
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return toTitleCase(seriesSlug);
}

function resolveLatestDate(parts: SeriesIndexPartEntry[]) {
  const validDates = parts
    .map((part) => part.date)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort((left, right) => right.localeCompare(left));

  return validDates[0] || "";
}

async function generateAssetsIndex() {
  console.log("Generating assets index...");
  const previousMeta =
    (await readJsonFile<AssetIndexMetaEntry[]>(ASSETS_INDEX_META_FILE)) || [];
  const previousMetaByUrl = new Map(previousMeta.map((entry) => [entry.url, entry]));
  const assets: AssetIndexEntry[] = [];
  const nextMeta: AssetIndexMetaEntry[] = [];
  const categories = ["img", "video", "audio", "doc"];

  for (const category of categories) {
    const dir = path.join(ASSETS_DIR, category);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) {
          continue;
        }

        const stat = await fs.stat(path.join(dir, entry.name));
        const url = `/assets/${category}/${entry.name}`;
        const fingerprint = getContentFingerprint(path.join(dir, entry.name), stat);
        const previousEntry = previousMetaByUrl.get(url);
        const lastModified =
          previousEntry &&
          previousEntry.size === stat.size &&
          previousEntry.fingerprint === fingerprint
            ? previousEntry.lastModified
            : stat.mtimeMs;

        assets.push({
          name: entry.name,
          url,
          category,
          size: stat.size,
          lastModified,
        });
        nextMeta.push({
          url,
          size: stat.size,
          fingerprint,
          lastModified,
        });
      }
    } catch {
      // Directory might not exist.
    }
  }

  assets.sort((left, right) => right.lastModified - left.lastModified);
  const didWrite = await writeJsonIfChanged(
    path.join(process.cwd(), "public", "assets-index.json"),
    assets,
  );

  if (!didWrite) {
    console.log("Assets index unchanged. Skipping write.");
  }

  await writeJsonIfChanged(ASSETS_INDEX_META_FILE, nextMeta);
}

async function getApiRoutes(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getApiRoutes(fullPath);
        }

        if (entry.name === "route.ts" || entry.name === "_route.ts") {
          return [fullPath];
        }

        return [];
      }),
    );

    return files.flat();
  } catch {
    return [];
  }
}

async function toggleApiRoutes(isWriteMode: boolean) {
  try {
    const routePaths = await getApiRoutes(API_DIR);

    for (const routePath of routePaths) {
      const activePath = routePath.endsWith("_route.ts")
        ? routePath.replace("_route.ts", "route.ts")
        : routePath;
      const hiddenPath = activePath.replace("route.ts", "_route.ts");
      const activeExists = await fs.stat(activePath).then(() => true).catch(() => false);
      const hiddenExists = await fs.stat(hiddenPath).then(() => true).catch(() => false);

      if (isWriteMode) {
        if (hiddenExists && !activeExists) {
          console.log(`Restoring ${hiddenPath} to ${activePath}`);
          await fs.rename(hiddenPath, activePath);
        }
      } else if (activeExists) {
        console.log(`Hiding ${activePath} to ${hiddenPath} for Read Mode`);
        await fs.rename(activePath, hiddenPath);
      }
    }
  } catch (error) {
    console.error("Failed to toggle API route modes:", error);
  }
}

async function buildBlogIndex() {
  const previousIndex = (await readJsonFile<BlogIndexData>(BLOG_INDEX_PATH)) || {
    generatedAt: "",
    items: [],
  };
  const previousEntries = new Map(previousIndex.items.map((entry) => [entry.fileName, entry]));
  const changedContent = new Map<string, { raw: string; content: string; contentHash: string }>();

  let fileNames: string[] = [];
  try {
    fileNames = (await fs.readdir(BLOGS_DIR))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));
  } catch {
    fileNames = [];
  }

  const items: BlogIndexEntry[] = [];

  for (const fileName of fileNames) {
    const fullPath = path.join(BLOGS_DIR, fileName);
    const stat = await fs.stat(fullPath);
    const fingerprint = getContentFingerprint(fullPath, stat);
    const previousEntry = previousEntries.get(fileName);

    if (previousEntry?.fingerprint === fingerprint) {
      items.push(previousEntry);
      continue;
    }

    console.log(`Indexing blog ${fileName}`);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data, content } = parseContentFrontmatter(raw);
    const contentHash = hashContent(raw);
    const entry: BlogIndexEntry = {
      fileName,
      fingerprint,
      contentHash,
      slug: fileName.replace(/\.mdx$/, ""),
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      description: data.description || "",
      stats: calculateContentStats(content),
    };

    changedContent.set(fileName, { raw, content, contentHash });
    items.push(entry);
  }

  items.sort((left, right) => (left.date < right.date ? 1 : -1));

  const itemsUnchanged = JSON.stringify(previousIndex.items) === JSON.stringify(items);
  if (itemsUnchanged) {
    console.log("Blog index unchanged. Reusing existing cache.");
    return { index: previousIndex, changedContent };
  }

  const nextIndex: BlogIndexData = {
    generatedAt: new Date().toISOString(),
    items,
  };

  await fs.writeFile(BLOG_INDEX_PATH, JSON.stringify(nextIndex));

  return { index: nextIndex, changedContent };
}

async function buildSeriesIndex() {
  const previousIndex = await readJsonFile<SeriesIndexData>(SERIES_INDEX_PATH);
  const previousEntries = new Map(
    (previousIndex?.entries || []).map((entry) => [entry.sourcePath, entry]),
  );
  const manifest = loadAggregatedSeriesManifest();
  const manifestFiles = [SERIES_SECTIONS_PATH, ...getSeriesDomainManifestPaths()];
  const manifestRaw = await Promise.all(
    manifestFiles.map(async (filePath) => {
      try {
        const raw = await fs.readFile(filePath, "utf8");
        return `${toRepoRelativePath(filePath)}\n${raw}`;
      } catch {
        return `${toRepoRelativePath(filePath)}\n`;
      }
    }),
  );
  const manifestHash = hashContent(manifestRaw.join("\n---\n"));

  const manifestChanged =
    previousIndex?.manifestHash !== manifestHash ||
    previousIndex?.formatVersion !== SERIES_INDEX_FORMAT_VERSION;
  const entries: SeriesIndexEntry[] = [];

  for (const seriesSource of [...manifest.series].sort((left, right) =>
    left.sourcePath.localeCompare(right.sourcePath),
  )) {
    const seriesDirectory = getSeriesContentDirectory(seriesSource.sourcePath);
    const previousEntry = previousEntries.get(seriesSource.sourcePath);
    const previousParts = new Map(
      (previousEntry?.parts || []).map((part) => [part.fileName, part]),
    );

    if (!(await fs.stat(seriesDirectory).then(() => true).catch(() => false))) {
      throw new Error(`Missing series directory for manifest entry: ${seriesSource.sourcePath}`);
    }

    const fileNames = (await fs.readdir(seriesDirectory))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));

    if (fileNames.length === 0) {
      throw new Error(`Series directory has no MDX parts: ${seriesSource.sourcePath}`);
    }

    const rawParts: SeriesIndexPartEntry[] = [];

    for (const fileName of fileNames) {
      const fullPath = path.join(seriesDirectory, fileName);
      const stat = await fs.stat(fullPath);
      const fingerprint = getContentFingerprint(fullPath, stat);
      const previousPart = previousParts.get(fileName);

      if (!manifestChanged && previousPart?.fingerprint === fingerprint) {
        rawParts.push(previousPart);
        continue;
      }

      console.log(`Indexing series part ${seriesSource.sourcePath}/${fileName}`);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = parseContentFrontmatter(raw);
      const frontmatter = data as SeriesFrontmatter;
      const slug = fileName.replace(/\.mdx$/, "");
      const order = extractOrder(slug, frontmatter.order);

      rawParts.push({
        fileName,
        fingerprint,
        contentHash: hashContent(raw),
        slug,
        title: frontmatter.title || toTitleCase(slug),
        date: normalizeDate(frontmatter.date),
        tags: frontmatter.tags || [],
        description: frontmatter.description || "",
        stats: calculateContentStats(content),
        order,
        partTitle: frontmatter.partTitle,
        seriesSlug: seriesSource.slug,
        seriesTitle: frontmatter.seriesTitle || "",
      });
    }

    const inferredTitle = inferSeriesTitle(seriesSource.directorySlug, fileNames);
    const parts = rawParts
      .map((part) => ({
        ...part,
        seriesTitle: part.seriesTitle || inferredTitle,
      }))
      .sort((left, right) => left.order - right.order);

    const firstPart = parts[0];
    const latestPart = parts[parts.length - 1];
    const summary = {
      seriesSlug: seriesSource.slug,
      seriesTitle: seriesSource.title || firstPart.seriesTitle,
      description:
        seriesSource.description ||
        firstPart.description ||
        `Structured learning track for ${firstPart.seriesTitle}.`,
      tags:
        seriesSource.tags && seriesSource.tags.length > 0
          ? seriesSource.tags
          : Array.from(new Set(parts.flatMap((part) => part.tags))).sort(),
      totalParts: parts.length,
      totalReadingTime: parts.reduce((total, part) => total + part.stats.readingTime, 0),
      firstPartSlug: firstPart.slug,
      latestPartSlug: latestPart.slug,
      lastUpdated: resolveLatestDate(parts),
    };

    entries.push({
      domainId: seriesSource.domainId,
      sourcePath: seriesSource.sourcePath,
      directorySlug: seriesSource.directorySlug,
      publicSlug: seriesSource.slug,
      summary,
      parts,
    });
  }

  entries.sort((left, right) => left.summary.seriesTitle.localeCompare(right.summary.seriesTitle));

  const entriesUnchanged =
    previousIndex?.formatVersion === SERIES_INDEX_FORMAT_VERSION &&
    previousIndex?.manifestHash === manifestHash &&
    JSON.stringify(previousIndex.entries) === JSON.stringify(entries);

  if (entriesUnchanged && previousIndex) {
    console.log("Series index unchanged. Reusing existing cache.");
    return previousIndex;
  }

  const nextIndex: SeriesIndexData = {
    formatVersion: SERIES_INDEX_FORMAT_VERSION,
    generatedAt: new Date().toISOString(),
    manifestHash,
    entries,
  };

  await fs.writeFile(SERIES_INDEX_PATH, JSON.stringify(nextIndex));
  return nextIndex;
}

async function buildBlogSearchArtifacts(index: BlogIndexData, changedContent: Map<string, { raw: string; content: string; contentHash: string }>) {
  const existingCache =
    (await readJsonFile<Record<string, EmbeddingCacheEntry>>(EMBEDDINGS_FILE)) || {};
  const nextCache: Record<string, EmbeddingCacheEntry> = {};
  const embeddings: Record<string, number[]> = {};
  const searchIndex: BlogSearchDocument[] = [];
  const dirtyFiles: Array<{
    fileName: string;
    slug: string;
    content: string;
    contentHash: string;
    fingerprint: string;
  }> = [];

  for (const entry of index.items) {
    searchIndex.push({
      id: entry.slug,
      title: entry.title,
      tags: entry.tags || [],
      description: entry.description || "",
    });

    const cachedEmbedding = existingCache[entry.fileName];
    if (cachedEmbedding?.fingerprint === entry.fingerprint) {
      embeddings[entry.slug] = cachedEmbedding.vector;
      nextCache[entry.fileName] = cachedEmbedding;
      continue;
    }

    const changed = changedContent.get(entry.fileName);
    const raw = changed?.raw || (await fs.readFile(path.join(BLOGS_DIR, entry.fileName), "utf8"));
    const content = changed?.content || parseContentFrontmatter(raw).content;
    const contentHash = changed?.contentHash || hashContent(raw);

    if (cachedEmbedding?.contentHash === contentHash) {
      embeddings[entry.slug] = cachedEmbedding.vector;
      nextCache[entry.fileName] = {
        fingerprint: entry.fingerprint,
        contentHash,
        vector: cachedEmbedding.vector,
      };
      continue;
    }

    dirtyFiles.push({
      fileName: entry.fileName,
      slug: entry.slug,
      content,
      contentHash,
      fingerprint: entry.fingerprint,
    });
  }

  if (dirtyFiles.length > 0) {
    console.log(`Embedding ${dirtyFiles.length} changed blog(s)...`);
    const { pipeline } = await import("@xenova/transformers");
    const embedder = await pipeline("feature-extraction", EMBEDDING_MODEL);

    for (const dirtyFile of dirtyFiles) {
      console.log(`Embedding ${dirtyFile.fileName}...`);
      const output = await embedder(dirtyFile.content, {
        pooling: "mean",
        normalize: true,
      });
      const vector = Array.from(output.data);
      embeddings[dirtyFile.slug] = vector;
      nextCache[dirtyFile.fileName] = {
        fingerprint: dirtyFile.fingerprint,
        contentHash: dirtyFile.contentHash,
        vector,
      };
    }
  } else {
    console.log("All blog embeddings are fresh. Skipping model load.");
  }

  const embeddingsUpdated = await writeJsonIfChanged(EMBEDDINGS_FILE, nextCache);
  const searchIndexUpdated = await writeJsonIfChanged(
    path.join(process.cwd(), "public", "search-index.json"),
    searchIndex,
  );

  const slugs = Object.keys(embeddings);
  const relations: Record<string, Array<{ slug: string; score: number }>> = {};

  for (const slug of slugs) {
    console.log(`Computing relations for ${slug}`);
    relations[slug] = slugs
      .filter((candidate) => candidate !== slug)
      .map((candidate) => ({
        slug: candidate,
        score: embeddings[slug].reduce(
          (total, value, index) => total + value * embeddings[candidate][index],
          0,
        ),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 3);
  }

  const relationsUpdated = await writeJsonIfChanged(
    path.join(process.cwd(), "public", "relations.json"),
    relations,
  );

  if (!embeddingsUpdated) {
    console.log("Embeddings cache unchanged. Skipping write.");
  }

  if (!searchIndexUpdated) {
    console.log("Search index unchanged. Skipping write.");
  }

  if (!relationsUpdated) {
    console.log("Relations index unchanged. Skipping write.");
  }
}

async function buildCompiledMdxCaches(
  blogIndex: BlogIndexData,
  seriesIndex: SeriesIndexData,
  changedContent: Map<string, { raw: string; content: string; contentHash: string }>,
) {
  let compiledBlogs = 0;
  let compiledSeriesParts = 0;

  for (const entry of blogIndex.items) {
    const cachePath = getBlogCompiledMdxCachePath(entry.slug);
    const existingCache =
      await readJsonFile<{ fingerprint?: string; version?: number }>(cachePath);

    if (
      existingCache?.version === COMPILED_MDX_CACHE_VERSION &&
      existingCache.fingerprint === entry.fingerprint
    ) {
      continue;
    }

    const changed = changedContent.get(entry.fileName);
    const raw = changed?.raw || (await fs.readFile(path.join(BLOGS_DIR, entry.fileName), "utf8"));
    const content = changed?.content || parseContentFrontmatter(raw).content;
    let cacheEntry;
    try {
      cacheEntry = await buildCompiledMdxCacheEntry({
        title: entry.title,
        content,
        fingerprint: entry.fingerprint,
      });
    } catch (error) {
      console.error(`Failed compiling blog MDX: ${path.join(BLOGS_DIR, entry.fileName)}`);
      throw error;
    }

    await ensureCompiledMdxCacheDirectory(cachePath);
    await writeJsonIfChanged(cachePath, cacheEntry);
    compiledBlogs += 1;
  }

  for (const seriesEntry of seriesIndex.entries) {
    for (const part of seriesEntry.parts) {
      const cachePath = getSeriesCompiledMdxCachePath(seriesEntry.publicSlug, part.slug);
      const existingCache =
        await readJsonFile<{ fingerprint?: string; version?: number }>(cachePath);

      if (
        existingCache?.version === COMPILED_MDX_CACHE_VERSION &&
        existingCache.fingerprint === part.fingerprint
      ) {
        continue;
      }

      const raw = await fs.readFile(
        path.join(SERIES_DIR, seriesEntry.sourcePath, part.fileName),
        "utf8",
      );
      const { content } = parseContentFrontmatter(raw);
      let cacheEntry;
      try {
        cacheEntry = await buildCompiledMdxCacheEntry({
          title: part.title,
          content,
          fingerprint: part.fingerprint,
        });
      } catch (error) {
        console.error(
          `Failed compiling series MDX: ${path.join(SERIES_DIR, seriesEntry.sourcePath, part.fileName)}`,
        );
        throw error;
      }

      await ensureCompiledMdxCacheDirectory(cachePath);
      await writeJsonIfChanged(cachePath, cacheEntry);
      compiledSeriesParts += 1;
    }
  }

  if (compiledBlogs > 0 || compiledSeriesParts > 0) {
    console.log(
      `Compiled ${compiledBlogs} blog MDX file(s) and ${compiledSeriesParts} series MDX file(s).`,
    );
  } else {
    console.log("Compiled MDX cache unchanged. Skipping recompilation.");
  }
}

async function run() {
  console.log("Starting pre-build...");
  await fs.mkdir(CONTENT_CACHE_DIR, { recursive: true });

  const isWriteMode = process.env.NEXT_PUBLIC_APP_MODE === "write";
  await toggleApiRoutes(isWriteMode);
  await toggleContentRoutePages(isWriteMode);

  const [{ index: blogIndex, changedContent }, seriesIndex] = await Promise.all([
    buildBlogIndex(),
    buildSeriesIndex(),
  ]);

  console.log(
    `Cached ${blogIndex.items.length} blog entries and ${seriesIndex.entries.length} series indexes.`,
  );

  await buildCompiledMdxCaches(blogIndex, seriesIndex, changedContent);
  await buildBlogSearchArtifacts(blogIndex, changedContent);
  await generateAssetsIndex();

  console.log("Build-time processing complete.");
}

run();
