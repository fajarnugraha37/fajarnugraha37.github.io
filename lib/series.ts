import fs from "fs";
import path from "path";
import {
  SeriesCatalogItem,
  SeriesCatalogSection,
  SeriesDetail,
  SeriesManifestSection,
  SeriesPart,
  SeriesPartSummary,
  SeriesSummary,
} from "@/types";
import {
  SERIES_INDEX_PATH,
  type SeriesIndexData,
  type SeriesIndexPartEntry,
} from "@/lib/content-index";
import { calculateContentStats } from "@/lib/mdx";
import { parseContentFrontmatter } from "@/lib/frontmatter";
import { buildSeriesOverviewPhases } from "@/lib/series-navigation";
import {
  getSeriesContentDirectory,
  getSeriesSourceMaps,
  loadAggregatedSeriesManifest,
  type AggregatedSeriesManifest,
  type ResolvedSeriesSource,
} from "@/lib/series-manifest";

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

interface SeriesResolvedSummary extends SeriesSummary {
  domainId: string;
  directorySlug: string;
  sourcePath: string;
}

const seriesPartSummariesCache = new Map<string, SeriesPartSummary[]>();
const seriesPartCache = new Map<string, SeriesPart>();
const seriesManifestCache: { value: AggregatedSeriesManifest | null } = { value: null };
const resolvedSeriesCache: { value: SeriesResolvedSummary[] | null } = { value: null };
const seriesDetailCache = new Map<string, SeriesDetail | null>();
const seriesIndexCache: { value: SeriesIndexData | null | undefined } = { value: undefined };

function isUsableSeriesIndex(index: SeriesIndexData | null, manifest: AggregatedSeriesManifest) {
  if (!index || !Array.isArray(index.entries) || index.entries.length === 0) {
    return false;
  }

  const manifestSourcePaths = new Set(manifest.series.map((entry) => entry.sourcePath));
  const indexedSourcePaths = new Set(index.entries.map((entry) => entry.sourcePath));

  if (manifestSourcePaths.size !== indexedSourcePaths.size) {
    return false;
  }

  for (const sourcePath of manifestSourcePaths) {
    if (!indexedSourcePaths.has(sourcePath)) {
      return false;
    }
  }

  return index.entries.every((entry) => {
    if (!entry.publicSlug || !entry.directorySlug || !entry.sourcePath) {
      return false;
    }

    return fs.existsSync(getSeriesContentDirectory(entry.sourcePath));
  });
}

function loadSeriesIndex() {
  if (seriesIndexCache.value !== undefined) {
    return seriesIndexCache.value;
  }

  try {
    if (!fs.existsSync(SERIES_INDEX_PATH)) {
      seriesIndexCache.value = null;
      return null;
    }

    const raw = fs.readFileSync(SERIES_INDEX_PATH, "utf8");
    const parsed = JSON.parse(raw) as SeriesIndexData;
    seriesIndexCache.value = isUsableSeriesIndex(parsed, getSeriesManifest()) ? parsed : null;
    return seriesIndexCache.value;
  } catch {
    seriesIndexCache.value = null;
    return null;
  }
}

function stripIndexedSeriesPart({
  fileName: _fileName,
  fingerprint: _fingerprint,
  contentHash: _contentHash,
  ...part
}: SeriesIndexPartEntry): SeriesPartSummary {
  return part;
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

function inferSeriesTitle(seriesSlug: string, parts: string[]) {
  const commonPrefix = parts[0]
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

function resolveLatestDate(parts: SeriesPartSummary[]) {
  const validDates = parts
    .map((part) => part.date)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort((left, right) => right.localeCompare(left));

  return validDates[0] || "";
}

function getSeriesManifest() {
  if (seriesManifestCache.value) {
    return seriesManifestCache.value;
  }

  const manifest = loadAggregatedSeriesManifest();
  seriesManifestCache.value = manifest;
  return manifest;
}

function findSeriesIndexEntry(seriesSlug: string) {
  const seriesIndex = loadSeriesIndex();
  if (!seriesIndex) {
    return null;
  }

  return (
    seriesIndex.entries.find(
      (entry) =>
        entry.directorySlug === seriesSlug ||
        entry.publicSlug === seriesSlug ||
        entry.sourcePath === seriesSlug,
    ) || null
  );
}

function getManifestEntryForSeries(
  seriesSlug: string,
  directorySlug?: string,
  sourcePath?: string,
) {
  const { bySlug, byDirectorySlug, bySourcePath } = getSeriesSourceMaps(getSeriesManifest());

  return (
    bySlug.get(seriesSlug) ||
    (sourcePath ? bySourcePath.get(sourcePath) : undefined) ||
    (directorySlug ? byDirectorySlug.get(directorySlug) : undefined) ||
    null
  );
}

function resolveSeriesSource(seriesSlug: string): ResolvedSeriesSource | null {
  const manifestEntry = getManifestEntryForSeries(seriesSlug);
  if (manifestEntry) {
    return manifestEntry;
  }

  const indexedEntry = findSeriesIndexEntry(seriesSlug);
  if (!indexedEntry) {
    return null;
  }

  return (
    getManifestEntryForSeries(
      indexedEntry.publicSlug,
      indexedEntry.directorySlug,
      indexedEntry.sourcePath,
    ) || null
  );
}

function readSeriesPartSummary(source: ResolvedSeriesSource, fileName: string): SeriesPartSummary {
  const fullPath = path.join(getSeriesContentDirectory(source.sourcePath), fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseContentFrontmatter(fileContents);
  const frontmatter = data as SeriesFrontmatter;
  const slug = fileName.replace(/\.mdx$/, "");
  const order = extractOrder(slug, frontmatter.order);

  return {
    slug,
    title: frontmatter.title || toTitleCase(slug),
    date: normalizeDate(frontmatter.date),
    tags: frontmatter.tags || [],
    description: frontmatter.description || "",
    stats: calculateContentStats(content),
    order,
    partTitle: frontmatter.partTitle,
    seriesSlug: source.slug,
    seriesTitle: frontmatter.seriesTitle || "",
  };
}

function readSeriesPart(source: ResolvedSeriesSource, fileName: string): SeriesPart {
  const fullPath = path.join(getSeriesContentDirectory(source.sourcePath), fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseContentFrontmatter(fileContents);
  const frontmatter = data as SeriesFrontmatter;
  const slug = fileName.replace(/\.mdx$/, "");
  const order = extractOrder(slug, frontmatter.order);

  return {
    slug,
    title: frontmatter.title || toTitleCase(slug),
    date: normalizeDate(frontmatter.date),
    tags: frontmatter.tags || [],
    description: frontmatter.description || "",
    stats: calculateContentStats(content),
    order,
    partTitle: frontmatter.partTitle,
    seriesSlug: source.slug,
    seriesTitle: frontmatter.seriesTitle || "",
    content,
  };
}

function getSeriesPartSummariesForSource(source: ResolvedSeriesSource): SeriesPartSummary[] {
  const cachedParts = seriesPartSummariesCache.get(source.sourcePath);
  if (cachedParts) {
    return cachedParts;
  }

  const indexedEntry = findSeriesIndexEntry(source.slug) || findSeriesIndexEntry(source.sourcePath);
  if (indexedEntry) {
    const parts = indexedEntry.parts.map(stripIndexedSeriesPart);
    seriesPartSummariesCache.set(source.sourcePath, parts);
    return parts;
  }

  const seriesDirectory = getSeriesContentDirectory(source.sourcePath);
  if (!fs.existsSync(seriesDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(seriesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"));

  const rawParts = fileNames.map((fileName) => readSeriesPartSummary(source, fileName));
  const inferredTitle = inferSeriesTitle(source.slug, fileNames);

  const parts = rawParts
    .map((part) => ({
      ...part,
      seriesTitle: part.seriesTitle || inferredTitle,
    }))
    .sort((left, right) => left.order - right.order);

  seriesPartSummariesCache.set(source.sourcePath, parts);
  return parts;
}

function getAllResolvedSeries(): SeriesResolvedSummary[] {
  const seriesIndex = loadSeriesIndex();
  if (seriesIndex) {
    return seriesIndex.entries.map((entry) => ({
      domainId: entry.domainId,
      sourcePath: entry.sourcePath,
      directorySlug: entry.directorySlug,
      ...entry.summary,
    }));
  }

  if (resolvedSeriesCache.value) {
    return resolvedSeriesCache.value;
  }

  const resolvedSeries = getSeriesManifest()
    .series.map((source) => {
      const parts = getSeriesPartSummariesForSource(source);
      if (parts.length === 0) {
        return null;
      }

      const firstPart = parts[0];
      const description =
        firstPart.description || `Structured learning track for ${firstPart.seriesTitle}.`;
      const tags = Array.from(new Set(parts.flatMap((part) => part.tags))).sort();
      const latestPart = parts[parts.length - 1];

      return {
        domainId: source.domainId,
        sourcePath: source.sourcePath,
        directorySlug: source.directorySlug,
        seriesSlug: source.slug,
        seriesTitle: firstPart.seriesTitle,
        description,
        tags,
        totalParts: parts.length,
        totalReadingTime: parts.reduce((total, part) => total + part.stats.readingTime, 0),
        firstPartSlug: firstPart.slug,
        latestPartSlug: latestPart.slug,
        lastUpdated: resolveLatestDate(parts),
      } satisfies SeriesResolvedSummary;
    })
    .filter((series): series is SeriesResolvedSummary => series !== null)
    .sort((left, right) => left.seriesTitle.localeCompare(right.seriesTitle));

  resolvedSeriesCache.value = resolvedSeries;
  return resolvedSeries;
}

export function getAllSeries(): SeriesSummary[] {
  return getAllResolvedSeries().map(
    ({ domainId: _domainId, directorySlug: _directorySlug, sourcePath: _sourcePath, ...series }) =>
      series,
  );
}

export function getSeriesSummaryBySlug(seriesSlug: string): SeriesSummary | null {
  const indexedEntry = findSeriesIndexEntry(seriesSlug);
  if (indexedEntry) {
    return indexedEntry.summary;
  }

  const summary = getAllResolvedSeries().find(
    (entry) => entry.seriesSlug === seriesSlug || entry.directorySlug === seriesSlug,
  );

  if (!summary) {
    return null;
  }

  const {
    domainId: _domainId,
    directorySlug: _directorySlug,
    sourcePath: _sourcePath,
    ...publicSummary
  } = summary;
  return publicSummary;
}

export function getSeriesCatalog(): SeriesCatalogSection[] {
  const summaries = getAllResolvedSeries();
  const manifest = getSeriesManifest();
  const sectionMetaById = new Map(manifest.sections.map((section) => [section.id, section]));
  const sections = [...manifest.sections];

  if (!sectionMetaById.has("uncategorized")) {
    const fallbackSection: SeriesManifestSection = {
      id: "uncategorized",
      title: "More Series",
      subtitle: "Additional tracks not yet grouped in the primary catalog.",
      description:
        "Series that exist in content but are not explicitly organized in the manifest yet.",
      order: 999,
    };

    sections.push(fallbackSection);
    sectionMetaById.set(fallbackSection.id, fallbackSection);
  }

  const catalogItems: SeriesCatalogItem[] = summaries
    .map((series) => {
      const manifestEntry = getManifestEntryForSeries(
        series.seriesSlug,
        series.directorySlug,
        series.sourcePath,
      );
      const sectionId =
        manifestEntry?.section && sectionMetaById.has(manifestEntry.section)
          ? manifestEntry.section
          : "uncategorized";

      return {
        ...series,
        sectionId,
        seriesOrder: manifestEntry?.order ?? 9999,
        featured: manifestEntry?.featured ?? false,
        featuredLabel: manifestEntry?.featuredLabel,
      };
    })
    .map(
      ({ domainId: _domainId, directorySlug: _directorySlug, sourcePath: _sourcePath, ...series }) =>
        series,
    );

  return sections
    .sort((left, right) => left.order - right.order)
    .map((section) => {
      const visibleItems = catalogItems
        .filter(
          (item) =>
            item.sectionId === section.id &&
            !getManifestEntryForSeries(item.seriesSlug)?.hidden,
        )
        .sort((left, right) => {
          if (left.seriesOrder !== right.seriesOrder) {
            return left.seriesOrder - right.seriesOrder;
          }

          return left.seriesTitle.localeCompare(right.seriesTitle);
        });

      if (visibleItems.length === 0) {
        return null;
      }

      const featured = visibleItems.filter((item) => item.featured);
      const items = visibleItems.filter((item) => !item.featured);

      return {
        id: section.id,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        order: section.order,
        featured,
        items,
      } satisfies SeriesCatalogSection;
    })
    .filter((section): section is SeriesCatalogSection => section !== null);
}

export function getSeriesBySlug(seriesSlug: string): SeriesDetail | null {
  if (seriesDetailCache.has(seriesSlug)) {
    return seriesDetailCache.get(seriesSlug) || null;
  }

  const indexedEntry = findSeriesIndexEntry(seriesSlug);
  if (indexedEntry) {
    const manifestEntry = getManifestEntryForSeries(
      indexedEntry.publicSlug,
      indexedEntry.directorySlug,
      indexedEntry.sourcePath,
    );
    const parts = indexedEntry.parts.map(stripIndexedSeriesPart);
    const phases = buildSeriesOverviewPhases(parts, manifestEntry?.phases);
    const detail = {
      summary: indexedEntry.summary,
      parts,
      phases,
    };
    seriesDetailCache.set(seriesSlug, detail);
    return detail;
  }

  const source = resolveSeriesSource(seriesSlug);
  if (!source) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const parts = getSeriesPartSummariesForSource(source);
  if (parts.length === 0) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const summary = getAllResolvedSeries().find(
    (series) => series.seriesSlug === source.slug || series.directorySlug === seriesSlug,
  );
  if (!summary) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const phases = buildSeriesOverviewPhases(parts, source.phases);
  const {
    domainId: _domainId,
    directorySlug: _directorySlug,
    sourcePath: _sourcePath,
    ...publicSummary
  } = summary;
  const detail = { summary: publicSummary, parts, phases };
  seriesDetailCache.set(seriesSlug, detail);
  return detail;
}

export function getSeriesPartSummaryBySlug(
  seriesSlug: string,
  partSlug: string,
): SeriesPartSummary | null {
  const source = resolveSeriesSource(seriesSlug);
  if (!source) {
    return null;
  }

  return getSeriesPartSummariesForSource(source).find((part) => part.slug === partSlug) || null;
}

export function getSeriesPart(seriesSlug: string, partSlug: string): SeriesPart | null {
  const source = resolveSeriesSource(seriesSlug);
  if (!source) {
    return null;
  }

  const cacheKey = `${source.sourcePath}:${partSlug}`;
  const cachedPart = seriesPartCache.get(cacheKey);
  if (cachedPart) {
    return cachedPart;
  }

  const fileName = `${partSlug}.mdx`;
  const fullPath = path.join(getSeriesContentDirectory(source.sourcePath), fileName);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const part = readSeriesPart(source, fileName);
  seriesPartCache.set(cacheKey, part);
  return part;
}

export function getAllSeriesSlugs() {
  const seriesIndex = loadSeriesIndex();
  if (seriesIndex) {
    return seriesIndex.entries.map((entry) => ({ seriesSlug: entry.publicSlug }));
  }

  return getAllSeries().map((series) => ({ seriesSlug: series.seriesSlug }));
}

export function getAllSeriesPartParams() {
  const seriesIndex = loadSeriesIndex();
  if (seriesIndex) {
    return seriesIndex.entries.flatMap((entry) =>
      entry.parts.map((part) => ({
        seriesSlug: entry.publicSlug,
        partSlug: part.slug,
      })),
    );
  }

  return getAllResolvedSeries().flatMap((series) => {
    const source = resolveSeriesSource(series.seriesSlug);
    if (!source) {
      return [];
    }

    return getSeriesPartSummariesForSource(source).map((part) => ({
      seriesSlug: series.seriesSlug,
      partSlug: part.slug,
    }));
  });
}

export function getAllSeriesPartEntries() {
  const seriesIndex = loadSeriesIndex();
  if (seriesIndex) {
    return seriesIndex.entries.flatMap((entry) =>
      entry.parts.map((part) => ({
        seriesSlug: entry.publicSlug,
        partSlug: part.slug,
        date: part.date,
      })),
    );
  }

  return getAllResolvedSeries().flatMap((series) => {
    const source = resolveSeriesSource(series.seriesSlug);
    if (!source) {
      return [];
    }

    return getSeriesPartSummariesForSource(source).map((part) => ({
      seriesSlug: series.seriesSlug,
      partSlug: part.slug,
      date: part.date,
    }));
  });
}
