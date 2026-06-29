import fs from "fs";
import path from "path";
import {
  SeriesCatalogItem,
  SeriesCatalogSection,
  SeriesDetail,
  SeriesManifestEntry,
  SeriesManifestPhase,
  SeriesManifestSection,
  SeriesPart,
  SeriesPartSummary,
  SeriesSummary,
} from "@/types";
import { calculateContentStats } from "@/lib/mdx";
import { parseContentFrontmatter } from "@/lib/frontmatter";
import { buildSeriesOverviewPhases } from "@/lib/series-navigation";

const seriesRootDirectory = path.join(process.cwd(), "content", "series");
const seriesManifestPath = path.join(seriesRootDirectory, "manifest.json");

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

interface SeriesDirectoryEntry {
  directorySlug: string;
  publicSlug: string;
}

interface SeriesResolvedSummary extends SeriesSummary {
  directorySlug: string;
}

interface SeriesManifestData {
  sections: SeriesManifestSection[];
  series: SeriesManifestEntry[];
}

const seriesPartSummariesCache = new Map<string, SeriesPartSummary[]>();
const seriesPartCache = new Map<string, SeriesPart>();
const seriesManifestCache: { value: SeriesManifestData | null } = { value: null };
const seriesDirectoryNamesCache: { value: string[] | null } = { value: null };
const seriesDirectoryEntriesCache: { value: SeriesDirectoryEntry[] | null } = { value: null };
const resolvedSeriesCache: { value: SeriesResolvedSummary[] | null } = { value: null };
const seriesDetailCache = new Map<string, SeriesDetail | null>();

function normalizeDate(value: SeriesFrontmatter["date"]) {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return String(value);
}

function ensureSeriesRootExists() {
  return fs.existsSync(seriesRootDirectory);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  const prefix = fileSlug.split("-part-")[0]?.trim();
  return prefix || directorySlug;
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

function normalizeManifestPhases(value: unknown): SeriesManifestPhase[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const phases = value
    .map((phase) => {
      if (!phase || typeof phase !== "object") {
        return null;
      }

      const candidate = phase as Partial<SeriesManifestPhase>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.fromOrder !== "number" ||
        typeof candidate.toOrder !== "number"
      ) {
        return null;
      }

      return {
        id: candidate.id,
        title: candidate.title,
        subtitle: candidate.subtitle,
        description: candidate.description,
        fromOrder: candidate.fromOrder,
        toOrder: candidate.toOrder,
      } satisfies SeriesManifestPhase;
    })
    .filter((phase): phase is SeriesManifestPhase => phase !== null);

  return phases.length > 0 ? phases : undefined;
}

function resolveLatestDate(parts: SeriesPartSummary[]) {
  const validDates = parts
    .map((part) => part.date)
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort((left, right) => right.localeCompare(left));

  return validDates[0] || "";
}

function readSeriesPartSummary(seriesSlug: string, fileName: string): SeriesPartSummary {
  const fullPath = path.join(seriesRootDirectory, seriesSlug, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseContentFrontmatter(fileContents);
  const frontmatter = data as SeriesFrontmatter;
  const slug = fileName.replace(/\.mdx$/, "");
  const order = extractOrder(slug, frontmatter.order);
  const inferredSeriesSlug = inferPublicSeriesSlug(seriesSlug, slug);

  return {
    slug,
    title: frontmatter.title || toTitleCase(slug),
    date: normalizeDate(frontmatter.date),
    tags: frontmatter.tags || [],
    description: frontmatter.description || "",
    stats: calculateContentStats(content),
    order,
    partTitle: frontmatter.partTitle,
    seriesSlug: frontmatter.series || inferredSeriesSlug,
    seriesTitle: frontmatter.seriesTitle || "",
  };
}

function readSeriesPart(seriesSlug: string, fileName: string): SeriesPart {
  const fullPath = path.join(seriesRootDirectory, seriesSlug, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseContentFrontmatter(fileContents);
  const frontmatter = data as SeriesFrontmatter;
  const slug = fileName.replace(/\.mdx$/, "");
  const order = extractOrder(slug, frontmatter.order);
  const inferredSeriesSlug = inferPublicSeriesSlug(seriesSlug, slug);

  return {
    slug,
    title: frontmatter.title || toTitleCase(slug),
    date: normalizeDate(frontmatter.date),
    tags: frontmatter.tags || [],
    description: frontmatter.description || "",
    stats: calculateContentStats(content),
    order,
    partTitle: frontmatter.partTitle,
    seriesSlug: frontmatter.series || inferredSeriesSlug,
    seriesTitle: frontmatter.seriesTitle || "",
    content,
  };
}

function getSeriesDirectoryNames() {
  if (seriesDirectoryNamesCache.value) {
    return seriesDirectoryNamesCache.value;
  }

  if (!ensureSeriesRootExists()) {
    return [];
  }

  const directoryNames = fs
    .readdirSync(seriesRootDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  seriesDirectoryNamesCache.value = directoryNames;
  return directoryNames;
}

function getSeriesDirectoryEntries(): SeriesDirectoryEntry[] {
  if (seriesDirectoryEntriesCache.value) {
    return seriesDirectoryEntriesCache.value;
  }

  const entries = getSeriesDirectoryNames()
    .map((directorySlug) => {
      const parts = getSeriesPartSummaries(directorySlug);
      if (parts.length === 0) {
        return null;
      }

      return {
        directorySlug,
        publicSlug: parts[0].seriesSlug || directorySlug,
      } satisfies SeriesDirectoryEntry;
    })
    .filter((entry): entry is SeriesDirectoryEntry => entry !== null);

  seriesDirectoryEntriesCache.value = entries;
  return entries;
}

function resolveSeriesDirectorySlug(seriesSlug: string) {
  const directMatch = getSeriesDirectoryNames().find((directorySlug) => directorySlug === seriesSlug);
  if (directMatch) {
    return directMatch;
  }

  const aliasMatch = getSeriesDirectoryEntries().find((entry) => entry.publicSlug === seriesSlug);
  return aliasMatch?.directorySlug || null;
}

function getSeriesPartSummaries(seriesSlug: string): SeriesPartSummary[] {
  const cachedParts = seriesPartSummariesCache.get(seriesSlug);
  if (cachedParts) {
    return cachedParts;
  }

  const seriesDirectory = path.join(seriesRootDirectory, seriesSlug);
  if (!fs.existsSync(seriesDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(seriesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"));

  const rawParts = fileNames.map((fileName) => readSeriesPartSummary(seriesSlug, fileName));
  const inferredTitle = inferSeriesTitle(seriesSlug, fileNames);

  const parts = rawParts
    .map((part) => ({
      ...part,
      seriesTitle: part.seriesTitle || inferredTitle,
    }))
    .sort((left, right) => left.order - right.order);

  seriesPartSummariesCache.set(seriesSlug, parts);
  return parts;
}

function getSeriesManifest(): SeriesManifestData {
  if (seriesManifestCache.value) {
    return seriesManifestCache.value;
  }

  try {
    if (!fs.existsSync(seriesManifestPath)) {
      const emptyManifest = { sections: [], series: [] };
      seriesManifestCache.value = emptyManifest;
      return emptyManifest;
    }

    const raw = fs.readFileSync(seriesManifestPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SeriesManifestData>;

    const manifest = {
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      series: Array.isArray(parsed.series)
        ? parsed.series.map((entry) => ({
            ...entry,
            phases: normalizeManifestPhases((entry as { phases?: unknown }).phases),
          }))
        : [],
    };
    seriesManifestCache.value = manifest;
    return manifest;
  } catch {
    const emptyManifest = { sections: [], series: [] };
    seriesManifestCache.value = emptyManifest;
    return emptyManifest;
  }
}

function getAllResolvedSeries(): SeriesResolvedSummary[] {
  if (resolvedSeriesCache.value) {
    return resolvedSeriesCache.value;
  }

  const resolvedSeries = getSeriesDirectoryEntries()
    .map(({ directorySlug, publicSlug }) => {
      const parts = getSeriesPartSummaries(directorySlug);
      if (parts.length === 0) {
        return null;
      }

      const firstPart = parts[0];
      const description =
        firstPart.description || `Structured learning track for ${firstPart.seriesTitle}.`;
      const tags = Array.from(new Set(parts.flatMap((part) => part.tags))).sort();
      const latestPart = parts[parts.length - 1];

      return {
        directorySlug,
        seriesSlug: publicSlug,
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
  return getAllResolvedSeries().map(({ directorySlug: _directorySlug, ...series }) => series);
}

export function getSeriesCatalog(): SeriesCatalogSection[] {
  const summaries = getAllResolvedSeries();
  const manifest = getSeriesManifest();
  const manifestBySlug = new Map(manifest.series.map((entry) => [entry.slug, entry]));
  const sectionMetaById = new Map(manifest.sections.map((section) => [section.id, section]));
  const sections = [...manifest.sections];
  const getManifestEntryForSeries = (seriesSlug: string, directorySlug?: string) =>
    manifestBySlug.get(seriesSlug) || (directorySlug ? manifestBySlug.get(directorySlug) : undefined);

  if (!sectionMetaById.has("uncategorized")) {
    const fallbackSection: SeriesManifestSection = {
      id: "uncategorized",
      title: "More Series",
      subtitle: "Additional tracks not yet grouped in the primary catalog.",
      description: "Series that exist in content but are not explicitly organized in the manifest yet.",
      order: 999,
    };

    sections.push(fallbackSection);
    sectionMetaById.set(fallbackSection.id, fallbackSection);
  }

  const catalogItems: SeriesCatalogItem[] = summaries.map((series) => {
    const manifestEntry = getManifestEntryForSeries(series.seriesSlug, series.directorySlug);
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
  }).map(({ directorySlug: _directorySlug, ...series }) => series);

  return sections
    .sort((left, right) => left.order - right.order)
    .map((section) => {
      const visibleItems = catalogItems
        .filter((item) => item.sectionId === section.id && !getManifestEntryForSeries(item.seriesSlug)?.hidden)
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

  const directorySlug = resolveSeriesDirectorySlug(seriesSlug);
  if (!directorySlug) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const parts = getSeriesPartSummaries(directorySlug);
  if (parts.length === 0) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const summary = getAllResolvedSeries().find((series) => series.seriesSlug === seriesSlug);
  if (!summary) {
    seriesDetailCache.set(seriesSlug, null);
    return null;
  }

  const manifest = getSeriesManifest();
  const manifestEntry =
    manifest.series.find((entry) => entry.slug === seriesSlug) ||
    manifest.series.find((entry) => entry.slug === directorySlug);
  const phases = buildSeriesOverviewPhases(parts, manifestEntry?.phases);
  const { directorySlug: _directorySlug, ...publicSummary } = summary;
  const detail = { summary: publicSummary, parts, phases };
  seriesDetailCache.set(seriesSlug, detail);
  return detail;
}

export function getSeriesPart(seriesSlug: string, partSlug: string): SeriesPart | null {
  const directorySlug = resolveSeriesDirectorySlug(seriesSlug);
  if (!directorySlug) {
    return null;
  }

  const cacheKey = `${directorySlug}:${partSlug}`;
  const cachedPart = seriesPartCache.get(cacheKey);
  if (cachedPart) {
    return cachedPart;
  }

  const fileName = `${partSlug}.mdx`;
  const fullPath = path.join(seriesRootDirectory, directorySlug, fileName);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const part = readSeriesPart(directorySlug, fileName);
  seriesPartCache.set(cacheKey, part);
  return part;
}

export function getAllSeriesSlugs() {
  return getAllSeries().map((series) => ({ seriesSlug: series.seriesSlug }));
}

export function getAllSeriesPartParams() {
  return getAllResolvedSeries().flatMap((series) =>
    getSeriesPartSummaries(series.directorySlug).map((part) => ({
      seriesSlug: series.seriesSlug,
      partSlug: part.slug,
    })),
  );
}
