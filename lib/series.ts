import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  SeriesDetail,
  SeriesPart,
  SeriesSummary,
} from "@/types";
import { calculateContentStats } from "@/lib/mdx";

const seriesRootDirectory = path.join(process.cwd(), "content", "series");

interface SeriesFrontmatter {
  title?: string;
  date?: string;
  tags?: string[];
  description?: string;
  series?: string;
  seriesTitle?: string;
  order?: number | string;
  partTitle?: string;
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
  const { data, content } = matter(fileContents);
  const frontmatter = data as SeriesFrontmatter;
  const slug = fileName.replace(/\.mdx$/, "");
  const order = extractOrder(slug, frontmatter.order);

  return {
    slug,
    title: frontmatter.title || toTitleCase(slug),
    date: frontmatter.date || "",
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

export function getAllSeries(): SeriesSummary[] {
  return getSeriesDirectoryNames()
    .map((seriesSlug) => {
      const parts = getSeriesParts(seriesSlug);
      if (parts.length === 0) {
        return null;
      }

      const firstPart = parts[0];
      const description =
        firstPart.description || `Structured learning track for ${firstPart.seriesTitle}.`;
      const tags = Array.from(new Set(parts.flatMap((part) => part.tags))).sort();

      return {
        seriesSlug,
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

export function getSeriesBySlug(seriesSlug: string): SeriesDetail | null {
  const parts = getSeriesParts(seriesSlug);
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
  const parts = getSeriesParts(seriesSlug);
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
