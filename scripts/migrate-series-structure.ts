import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";
import {
  LEGACY_SERIES_MANIFEST_PATH,
  SERIES_ROOT_DIRECTORY,
  SERIES_SECTIONS_PATH,
  inferSeriesDomainFromSlug,
} from "../lib/series-manifest";
import type { SeriesManifestEntry, SeriesManifestSection } from "../types";

interface LegacySeriesManifest {
  sections: SeriesManifestSection[];
  series: SeriesManifestEntry[];
}

interface SeriesFrontmatter {
  series?: string;
  order?: number | string;
}

interface LegacySeriesDirectoryInfo {
  directorySlug: string;
  publicSlug: string;
  currentPath: string;
  currentRelativePath: string;
}

function inferPublicSeriesSlug(directorySlug: string, fileSlug: string) {
  const prefix = fileSlug.split("-part-")[0]?.trim().replace(/[-_]+$/, "");
  return prefix || directorySlug;
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

async function exists(targetPath: string) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function scanLegacySeriesDirectories(): Promise<LegacySeriesDirectoryInfo[]> {
  const entries = await fs.readdir(SERIES_ROOT_DIRECTORY, { withFileTypes: true });
  const directoryLocations = entries
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      if (existsSync(path.join(SERIES_ROOT_DIRECTORY, entry.name, "manifest.json"))) {
        return fs
          .readdir(path.join(SERIES_ROOT_DIRECTORY, entry.name), { withFileTypes: true })
          .then((children) =>
            children
              .filter((child) => child.isDirectory())
              .map((child) => ({
                directorySlug: child.name,
                currentPath: path.join(SERIES_ROOT_DIRECTORY, entry.name, child.name),
                currentRelativePath: `${entry.name}/${child.name}`,
              })),
          );
      }

      return Promise.resolve([
        {
          directorySlug: entry.name,
          currentPath: path.join(SERIES_ROOT_DIRECTORY, entry.name),
          currentRelativePath: entry.name,
        },
      ]);
    });
  const flattened = (await Promise.all(directoryLocations)).flat();
  const directories: LegacySeriesDirectoryInfo[] = [];

  for (const directoryInfo of flattened) {
    const fileNames = (await fs.readdir(directoryInfo.currentPath))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));

    if (fileNames.length === 0) {
      throw new Error(`Legacy series directory has no MDX parts: ${directoryInfo.currentRelativePath}`);
    }

    const parts = [];
    for (const fileName of fileNames) {
      const raw = await fs.readFile(path.join(directoryInfo.currentPath, fileName), "utf8");
      const { data } = parseContentFrontmatter(raw);
      const frontmatter = data as SeriesFrontmatter;
      const slug = fileName.replace(/\.mdx$/, "");
      parts.push({
        order: extractOrder(slug, frontmatter.order),
        seriesSlug: frontmatter.series || inferPublicSeriesSlug(directoryInfo.directorySlug, slug),
      });
    }

    parts.sort((left, right) => left.order - right.order);
    const publicSlug = parts[0]?.seriesSlug;
    if (!publicSlug) {
      throw new Error(`Unable to infer public slug for legacy directory: ${directoryInfo.currentRelativePath}`);
    }

    directories.push({
      directorySlug: directoryInfo.directorySlug,
      publicSlug,
      currentPath: directoryInfo.currentPath,
      currentRelativePath: directoryInfo.currentRelativePath,
    });
  }

  return directories;
}

function cleanManifestEntry(entry: SeriesManifestEntry, directory: string) {
  const nextEntry: SeriesManifestEntry = {
    slug: entry.slug,
    directory,
    section: entry.section,
    order: entry.order,
  };

  if (entry.featured !== undefined) {
    nextEntry.featured = entry.featured;
  }

  if (entry.featuredLabel) {
    nextEntry.featuredLabel = entry.featuredLabel;
  }

  if (entry.hidden !== undefined) {
    nextEntry.hidden = entry.hidden;
  }

  if (entry.phases && entry.phases.length > 0) {
    nextEntry.phases = entry.phases;
  }

  return nextEntry;
}

function isTokenSubsequence(candidate: string, target: string) {
  const candidateTokens = candidate.split("-").filter(Boolean);
  const targetTokens = target.split("-").filter(Boolean);
  let candidateIndex = 0;

  for (const token of targetTokens) {
    if (token === candidateTokens[candidateIndex]) {
      candidateIndex += 1;
      if (candidateIndex >= candidateTokens.length) {
        return true;
      }
    }
  }

  return candidateIndex >= candidateTokens.length;
}

function resolveManifestEntriesForDirectory(
  directoryInfo: LegacySeriesDirectoryInfo,
  manifestEntriesBySlug: Map<string, SeriesManifestEntry[]>,
) {
  const exactDirectorySlug = manifestEntriesBySlug.get(directoryInfo.directorySlug);
  if (exactDirectorySlug) {
    return exactDirectorySlug;
  }

  const sortCandidates = (candidateSlugs: string[], target: string) =>
    [...candidateSlugs].sort((left, right) => {
      const leftDistance = Math.abs(left.length - target.length);
      const rightDistance = Math.abs(right.length - target.length);
      if (leftDistance !== rightDistance) {
        return leftDistance - rightDistance;
      }

      return left.localeCompare(right);
    });

  const directoryCandidates = [...manifestEntriesBySlug.keys()].filter((slug) =>
    isTokenSubsequence(slug, directoryInfo.directorySlug),
  );
  if (directoryCandidates.length > 0) {
    const sorted = sortCandidates(directoryCandidates, directoryInfo.directorySlug);
    if (sorted.length > 1) {
      console.log(
        `Fallback manifest mapping for ${directoryInfo.directorySlug}; choosing ${sorted[0]} from [${sorted.join(", ")}]`,
      );
    }

    return manifestEntriesBySlug.get(sorted[0]) || [];
  }

  const exactPublicSlug = manifestEntriesBySlug.get(directoryInfo.publicSlug);
  if (exactPublicSlug) {
    return exactPublicSlug;
  }

  const publicSlugCandidates = [...manifestEntriesBySlug.keys()].filter((slug) =>
    isTokenSubsequence(slug, directoryInfo.publicSlug),
  );

  if (publicSlugCandidates.length === 0) {
    return [];
  }

  const sorted = sortCandidates(publicSlugCandidates, directoryInfo.publicSlug);
  if (sorted.length > 1) {
    console.log(
      `Fallback manifest mapping for ${directoryInfo.directorySlug}; choosing ${sorted[0]} from [${sorted.join(", ")}]`,
    );
  }

  return manifestEntriesBySlug.get(sorted[0]) || [];
}

async function run() {
  if (!(await exists(LEGACY_SERIES_MANIFEST_PATH))) {
    throw new Error(`Legacy manifest not found: ${LEGACY_SERIES_MANIFEST_PATH}`);
  }

  const rawManifest = await fs.readFile(LEGACY_SERIES_MANIFEST_PATH, "utf8");
  const legacyManifest = JSON.parse(rawManifest) as LegacySeriesManifest;
  const directories = await scanLegacySeriesDirectories();
  const manifestEntriesBySlug = new Map<string, SeriesManifestEntry[]>();

  for (const entry of legacyManifest.series || []) {
    const current = manifestEntriesBySlug.get(entry.slug) || [];
    current.push(entry);
    manifestEntriesBySlug.set(entry.slug, current);
  }

  const sections = {
    sections: Array.isArray(legacyManifest.sections) ? legacyManifest.sections : [],
  };
  const grouped = new Map<string, SeriesManifestEntry[]>();
  const usedManifestSlugs = new Set<string>();

  for (const section of legacyManifest.sections || []) {
    if (typeof section.id === "string" && section.id.length > 0) {
      grouped.set(section.id, []);
    }
  }

  for (const directoryInfo of directories) {
    const manifestEntries = resolveManifestEntriesForDirectory(
      directoryInfo,
      manifestEntriesBySlug,
    );
    if (manifestEntries.length === 0) {
      throw new Error(
        `Legacy content directory is not registered in manifest: ${directoryInfo.directorySlug} -> ${directoryInfo.publicSlug}`,
      );
    }

    if (manifestEntries.length > 1) {
      console.log(
        `Duplicate legacy manifest slug detected for ${directoryInfo.publicSlug}; using first entry and dropping ${manifestEntries.length - 1} duplicate(s).`,
      );
    }

    const entry = manifestEntries[0];
    usedManifestSlugs.add(entry.slug);

    const bucketId =
      (typeof entry.section === "string" && entry.section.length > 0 ? entry.section : null) ||
      inferSeriesDomainFromSlug(directoryInfo.directorySlug) ||
      inferSeriesDomainFromSlug(directoryInfo.publicSlug);
    if (!bucketId) {
      throw new Error(`Unable to infer bucket for series slug: ${directoryInfo.publicSlug}`);
    }

    if (!grouped.has(bucketId)) {
      grouped.set(bucketId, []);
    }

    grouped.get(bucketId)?.push(cleanManifestEntry(entry, directoryInfo.directorySlug));
  }

  for (const [slug, entries] of manifestEntriesBySlug.entries()) {
    if (!usedManifestSlugs.has(slug) && entries.length > 0) {
      console.log(`Skipping unmatched legacy manifest slug: ${slug}`);
    }
  }

  await fs.writeFile(SERIES_SECTIONS_PATH, JSON.stringify(sections, null, 2));

  for (const bucketId of [...grouped.keys()]) {
    const domainDirectory = path.join(SERIES_ROOT_DIRECTORY, bucketId);
    const domainManifestPath = path.join(domainDirectory, "manifest.json");
    await fs.mkdir(domainDirectory, { recursive: true });
    const series = (grouped.get(bucketId) || []).sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.slug.localeCompare(right.slug);
    });

    await fs.writeFile(
      domainManifestPath,
      JSON.stringify({ series }, null, 2),
    );
  }

  for (const directoryInfo of directories) {
    const manifestEntries = resolveManifestEntriesForDirectory(
      directoryInfo,
      manifestEntriesBySlug,
    );
    const entry = manifestEntries[0];
    const bucketId =
      (typeof entry?.section === "string" && entry.section.length > 0 ? entry.section : null) ||
      inferSeriesDomainFromSlug(directoryInfo.directorySlug) ||
      inferSeriesDomainFromSlug(directoryInfo.publicSlug);
    if (!bucketId) {
      throw new Error(`Unable to infer bucket for series slug: ${directoryInfo.publicSlug}`);
    }

    const targetPath = path.join(SERIES_ROOT_DIRECTORY, bucketId, directoryInfo.directorySlug);
    const targetRelativePath = `${bucketId}/${directoryInfo.directorySlug}`;

    if (directoryInfo.currentPath === targetPath) {
      continue;
    }

    if (!(await exists(directoryInfo.currentPath))) {
      throw new Error(`Missing source directory before move: ${directoryInfo.currentRelativePath}`);
    }

    if (await exists(targetPath)) {
      throw new Error(
        `Target directory already exists for move: ${targetRelativePath} (from ${directoryInfo.currentRelativePath})`,
      );
    }

    await fs.rename(directoryInfo.currentPath, targetPath);
    console.log(`Moved ${directoryInfo.currentRelativePath} -> ${targetRelativePath}`);
  }

  await fs.unlink(LEGACY_SERIES_MANIFEST_PATH);
  console.log("Series migration complete.");
}

run().catch((error) => {
  console.error("Series migration failed:", error);
  process.exit(1);
});
