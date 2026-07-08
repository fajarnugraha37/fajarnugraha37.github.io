import fs from "fs/promises";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";
import {
  getSeriesContentDirectory,
  getSeriesDomainIds,
  loadSeriesDomainManifest,
} from "../lib/series-manifest";
import type { SeriesManifestEntry } from "../types";

interface SeriesFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  seriesTitle?: string;
  order?: number | string;
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

  const lessonMatch = fileSlug.match(/lesson[-_]?0*(\d+)/i);
  if (lessonMatch) {
    return Number(lessonMatch[1]);
  }

  const numberMatch = fileSlug.match(/(\d+)/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }

  return Number.MAX_SAFE_INTEGER;
}

function toTitleCase(input: string) {
  return input
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function inferSeriesTitle(directory: string, fileNames: string[]) {
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

  return toTitleCase(directory);
}

async function run() {
  for (const domainId of getSeriesDomainIds()) {
    const { manifestPath, entries } = loadSeriesDomainManifest(domainId);
    const nextEntries: SeriesManifestEntry[] = [];

    for (const entry of entries) {
      const directoryPath = getSeriesContentDirectory(entry.sourcePath);
      const fileNames = (await fs.readdir(directoryPath))
        .filter((fileName) => fileName.endsWith(".mdx"))
        .sort((left, right) => left.localeCompare(right));

      const parts = await Promise.all(
        fileNames.map(async (fileName) => {
          const raw = await fs.readFile(path.join(directoryPath, fileName), "utf8");
          const { data } = parseContentFrontmatter(raw);
          const frontmatter = data as SeriesFrontmatter;
          const slug = fileName.replace(/\.mdx$/, "");

          return {
            order: extractOrder(slug, frontmatter.order),
            seriesTitle: frontmatter.seriesTitle,
            description: frontmatter.description,
            tags: frontmatter.tags || [],
          };
        }),
      );

      parts.sort((left, right) => left.order - right.order);
      const firstPart = parts[0];
      const inferredTags = Array.from(
        new Set(parts.flatMap((part) => part.tags).filter((tag) => typeof tag === "string" && tag.length > 0)),
      ).sort();

      nextEntries.push({
        slug: entry.slug,
        directory: entry.directory,
        title:
          entry.title ||
          firstPart?.seriesTitle ||
          inferSeriesTitle(entry.directory || entry.slug, fileNames),
        description: entry.description || firstPart?.description || "",
        tags: entry.tags && entry.tags.length > 0 ? entry.tags : inferredTags,
        section: entry.section,
        order: entry.order,
        featured: entry.featured,
        featuredLabel: entry.featuredLabel,
        hidden: entry.hidden,
        phases: entry.phases,
      });
    }

    await fs.writeFile(
      manifestPath,
      `${JSON.stringify({ series: nextEntries }, null, 2)}\n`,
      "utf8",
    );
    console.log(`Backfilled ${domainId} manifest: ${nextEntries.length} series`);
  }
}

run().catch((error) => {
  console.error("Failed to backfill series manifest metadata:", error);
  process.exit(1);
});
