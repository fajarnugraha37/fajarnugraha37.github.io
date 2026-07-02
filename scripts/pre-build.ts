import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { parseContentFrontmatter } from "../lib/frontmatter";
import {
  BLOG_INDEX_PATH,
  CONTENT_CACHE_DIR,
  SERIES_INDEX_PATH,
  type BlogIndexData,
  type BlogIndexEntry,
  type SeriesIndexData,
  type SeriesIndexEntry,
  type SeriesIndexPartEntry,
} from "../lib/content-index";

const BLOGS_DIR = path.join(process.cwd(), "content", "blogs");
const SERIES_DIR = path.join(process.cwd(), "content", "series");
const SERIES_MANIFEST_PATH = path.join(SERIES_DIR, "manifest.json");
const EMBEDDINGS_FILE = path.join(CONTENT_CACHE_DIR, "embeddings.json");
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

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
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
  const assets: Array<{
    name: string;
    url: string;
    category: string;
    size: number;
    lastModified: number;
  }> = [];
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
        assets.push({
          name: entry.name,
          url: `/assets/${category}/${entry.name}`,
          category,
          size: stat.size,
          lastModified: stat.mtimeMs,
        });
      }
    } catch {
      // Directory might not exist.
    }
  }

  assets.sort((left, right) => right.lastModified - left.lastModified);
  await fs.writeFile(
    path.join(process.cwd(), "public", "assets-index.json"),
    JSON.stringify(assets),
  );
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
    const fingerprint = fingerprintFromStat(stat);
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
    (previousIndex?.entries || []).map((entry) => [entry.directorySlug, entry]),
  );

  let manifestRaw = '{"sections":[],"series":[]}';
  try {
    manifestRaw = await fs.readFile(SERIES_MANIFEST_PATH, "utf8");
  } catch {
    // fall back to empty manifest
  }

  const manifestHash = hashContent(manifestRaw);
  const parsedManifest = JSON.parse(manifestRaw) as { series?: Array<{ slug: string }> };
  const manifestSlugs = new Set((parsedManifest.series || []).map((entry) => entry.slug));

  let directoryNames: string[] = [];
  try {
    directoryNames = (await fs.readdir(SERIES_DIR, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch {
    directoryNames = [];
  }

  const manifestChanged = previousIndex?.manifestHash !== manifestHash;
  const entries: SeriesIndexEntry[] = [];

  for (const directorySlug of directoryNames) {
    const seriesDirectory = path.join(SERIES_DIR, directorySlug);
    const previousEntry = previousEntries.get(directorySlug);
    const previousParts = new Map(
      (previousEntry?.parts || []).map((part) => [part.fileName, part]),
    );

    const fileNames = (await fs.readdir(seriesDirectory))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));

    if (fileNames.length === 0) {
      continue;
    }

    const rawParts: SeriesIndexPartEntry[] = [];

    for (const fileName of fileNames) {
      const fullPath = path.join(seriesDirectory, fileName);
      const stat = await fs.stat(fullPath);
      const fingerprint = fingerprintFromStat(stat);
      const previousPart = previousParts.get(fileName);

      if (!manifestChanged && previousPart?.fingerprint === fingerprint) {
        rawParts.push(previousPart);
        continue;
      }

      console.log(`Indexing series part ${directorySlug}/${fileName}`);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = parseContentFrontmatter(raw);
      const frontmatter = data as SeriesFrontmatter;
      const slug = fileName.replace(/\.mdx$/, "");
      const order = extractOrder(slug, frontmatter.order);
      const publicSeriesSlug = resolvePublicSeriesSlug(
        directorySlug,
        slug,
        frontmatter.series,
        manifestSlugs,
      );

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
        seriesSlug: publicSeriesSlug,
        seriesTitle: frontmatter.seriesTitle || "",
      });
    }

    const inferredTitle = inferSeriesTitle(directorySlug, fileNames);
    const parts = rawParts
      .map((part) => ({
        ...part,
        seriesTitle: part.seriesTitle || inferredTitle,
      }))
      .sort((left, right) => left.order - right.order);

    const firstPart = parts[0];
    const latestPart = parts[parts.length - 1];
    const publicSlug = firstPart.seriesSlug || directorySlug;
    const summary = {
      seriesSlug: publicSlug,
      seriesTitle: firstPart.seriesTitle,
      description:
        firstPart.description || `Structured learning track for ${firstPart.seriesTitle}.`,
      tags: Array.from(new Set(parts.flatMap((part) => part.tags))).sort(),
      totalParts: parts.length,
      totalReadingTime: parts.reduce((total, part) => total + part.stats.readingTime, 0),
      firstPartSlug: firstPart.slug,
      latestPartSlug: latestPart.slug,
      lastUpdated: resolveLatestDate(parts),
    };

    entries.push({
      directorySlug,
      publicSlug,
      summary,
      parts,
    });
  }

  entries.sort((left, right) => left.summary.seriesTitle.localeCompare(right.summary.seriesTitle));

  const nextIndex: SeriesIndexData = {
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

  await fs.writeFile(EMBEDDINGS_FILE, JSON.stringify(nextCache));
  await fs.writeFile(
    path.join(process.cwd(), "public", "search-index.json"),
    JSON.stringify(searchIndex),
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

  await fs.writeFile(
    path.join(process.cwd(), "public", "relations.json"),
    JSON.stringify(relations),
  );
}

async function run() {
  console.log("Starting pre-build...");
  await fs.mkdir(CONTENT_CACHE_DIR, { recursive: true });

  const isWriteMode = process.env.NEXT_PUBLIC_APP_MODE === "write";
  await toggleApiRoutes(isWriteMode);

  const [{ index: blogIndex, changedContent }, seriesIndex] = await Promise.all([
    buildBlogIndex(),
    buildSeriesIndex(),
  ]);

  console.log(
    `Cached ${blogIndex.items.length} blog entries and ${seriesIndex.entries.length} series indexes.`,
  );

  await buildBlogSearchArtifacts(blogIndex, changedContent);
  await generateAssetsIndex();

  console.log("Build-time processing complete.");
}

run();
