import fs from "fs";
import path from "path";
import {
  SeriesCatalogItem,
  SeriesCatalogSection,
  SeriesDetail,
  SeriesManifestEntry,
  SeriesManifestSection,
  SeriesPart,
  SeriesSummary,
} from "@/types";
import { calculateContentStats } from "@/lib/mdx";
import { parseContentFrontmatter } from "@/lib/frontmatter";

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

interface SeriesManifestData {
  sections: SeriesManifestSection[];
  series: SeriesManifestEntry[];
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

function readSeriesPart(seriesSlug: string, fileName: string): SeriesPart {
  const fullPath = path.join(seriesRootDirectory, seriesSlug, fileName);
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
    content,
    stats: calculateContentStats(content),
    order,
    partTitle: frontmatter.partTitle,
    seriesSlug: frontmatter.series || seriesSlug,
    seriesTitle: frontmatter.seriesTitle || "",
  };
}

function getSeriesDirectoryNames() {
  if (!ensureSeriesRootExists()) {
    return [];
  }

  return fs
    .readdirSync(seriesRootDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function getSeriesDirectoryEntries(): SeriesDirectoryEntry[] {
  return getSeriesDirectoryNames()
    .map((directorySlug) => {
      const parts = getSeriesParts(directorySlug);
      if (parts.length === 0) {
        return null;
      }

      return {
        directorySlug,
        publicSlug: parts[0].seriesSlug || directorySlug,
      } satisfies SeriesDirectoryEntry;
    })
    .filter((entry): entry is SeriesDirectoryEntry => entry !== null);
}

function resolveSeriesDirectorySlug(seriesSlug: string) {
  const directMatch = getSeriesDirectoryNames().find((directorySlug) => directorySlug === seriesSlug);
  if (directMatch) {
    return directMatch;
  }

  const aliasMatch = getSeriesDirectoryEntries().find((entry) => entry.publicSlug === seriesSlug);
  return aliasMatch?.directorySlug || null;
}

function getSeriesParts(seriesSlug: string): SeriesPart[] {
  const seriesDirectory = path.join(seriesRootDirectory, seriesSlug);
  if (!fs.existsSync(seriesDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(seriesDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"));

  const rawParts = fileNames.map((fileName) => readSeriesPart(seriesSlug, fileName));
  const inferredTitle = inferSeriesTitle(seriesSlug, fileNames);

  return rawParts
    .map((part) => ({
      ...part,
      seriesTitle: part.seriesTitle || inferredTitle,
    }))
    .sort((left, right) => left.order - right.order);
}

function getSeriesManifest(): SeriesManifestData {
  try {
    if (!fs.existsSync(seriesManifestPath)) {
      return { sections: [], series: [] };
    }

    const raw = fs.readFileSync(seriesManifestPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<SeriesManifestData>;

    return {
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      series: Array.isArray(parsed.series) ? parsed.series : [],
    };
  } catch {
    return { sections: [], series: [] };
  }
}

export function getAllSeries(): SeriesSummary[] {
  return getSeriesDirectoryEntries()
    .map(({ directorySlug, publicSlug }) => {
      const parts = getSeriesParts(directorySlug);
      if (parts.length === 0) {
        return null;
      }

      const firstPart = parts[0];
      const description =
        firstPart.description || `Structured learning track for ${firstPart.seriesTitle}.`;
      const tags = Array.from(new Set(parts.flatMap((part) => part.tags))).sort();

      return {
        seriesSlug: publicSlug,
        seriesTitle: firstPart.seriesTitle,
        description,
        tags,
        totalParts: parts.length,
        totalReadingTime: parts.reduce((total, part) => total + part.stats.readingTime, 0),
        firstPartSlug: firstPart.slug,
      } satisfies SeriesSummary;
    })
    .filter((series): series is SeriesSummary => series !== null)
    .sort((left, right) => left.seriesTitle.localeCompare(right.seriesTitle));
}

export function getSeriesCatalog(): SeriesCatalogSection[] {
  const summaries = getAllSeries();
  const manifest = getSeriesManifest();
  const manifestBySlug = new Map(manifest.series.map((entry) => [entry.slug, entry]));
  const sectionMetaById = new Map(manifest.sections.map((section) => [section.id, section]));
  const sections = [...manifest.sections];

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
    const manifestEntry = manifestBySlug.get(series.seriesSlug);
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
  });

  return sections
    .sort((left, right) => left.order - right.order)
    .map((section) => {
      const visibleItems = catalogItems
        .filter((item) => item.sectionId === section.id && !(manifestBySlug.get(item.seriesSlug)?.hidden))
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
  const directorySlug = resolveSeriesDirectorySlug(seriesSlug);
  if (!directorySlug) {
    return null;
  }

  const parts = getSeriesParts(directorySlug);
  if (parts.length === 0) {
    return null;
  }

  const summary = getAllSeries().find((series) => series.seriesSlug === seriesSlug);
  if (!summary) {
    return null;
  }

  return { summary, parts };
}

export function getSeriesPart(seriesSlug: string, partSlug: string): SeriesPart | null {
  const directorySlug = resolveSeriesDirectorySlug(seriesSlug);
  if (!directorySlug) {
    return null;
  }

  const parts = getSeriesParts(directorySlug);
  return parts.find((part) => part.slug === partSlug) || null;
}

export function getAllSeriesSlugs() {
  return getAllSeries().map((series) => ({ seriesSlug: series.seriesSlug }));
}

export function getAllSeriesPartParams() {
  return getAllSeries().flatMap((series) => {
    const detail = getSeriesBySlug(series.seriesSlug);
    if (!detail) {
      return [];
    }

    return detail.parts.map((part) => ({
      seriesSlug: detail.summary.seriesSlug,
      partSlug: part.slug,
    }));
  });
}
