import fs from "fs";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";
import {
  getSeriesDomainIds,
  getSeriesContentDirectory,
  loadSeriesSections,
  loadAggregatedSeriesManifest,
} from "../lib/series-manifest";

interface SeriesFrontmatter {
  title?: string;
  series?: string;
  seriesTitle?: string;
  order?: number | string;
  partTitle?: string;
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

function fail(errors: string[]) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

function run() {
  const manifest = loadAggregatedSeriesManifest();
  const sections = loadSeriesSections();
  const errors: string[] = [];
  const slugSet = new Set<string>();
  const sourcePathSet = new Set<string>();
  const validSectionIds = new Set(manifest.sections.map((section) => section.id));
  const expectedBucketIds = new Set(sections.sections.map((section) => section.id));

  for (const entry of manifest.series) {
    if (slugSet.has(entry.slug)) {
      errors.push(`Duplicate series slug: ${entry.slug}`);
    } else {
      slugSet.add(entry.slug);
    }

    if (sourcePathSet.has(entry.sourcePath)) {
      errors.push(`Duplicate sourcePath: ${entry.sourcePath}`);
    } else {
      sourcePathSet.add(entry.sourcePath);
    }

    if (!validSectionIds.has(entry.section)) {
      errors.push(`Series slug ${entry.slug} references unknown section: ${entry.section}`);
    }

    if (entry.section !== entry.domainId) {
      errors.push(
        `Series slug ${entry.slug} section mismatch: manifest section "${entry.section}" must equal bucket "${entry.domainId}"`,
      );
    }

    const directory = getSeriesContentDirectory(entry.sourcePath);
    if (!fs.existsSync(directory)) {
      errors.push(`Missing content directory: ${entry.sourcePath}`);
      continue;
    }

    const fileNames = fs
      .readdirSync(directory)
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));

    if (fileNames.length === 0) {
      errors.push(`Series directory has no MDX parts: ${entry.sourcePath}`);
      continue;
    }

    const derivedSeriesSlugs: string[] = [];

    for (const fileName of fileNames) {
      const fullPath = path.join(directory, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = parseContentFrontmatter(raw);
      const frontmatter = data as SeriesFrontmatter;
      const fileSlug = fileName.replace(/\.mdx$/, "");
      const resolvedSeriesSlug =
        frontmatter.series || inferPublicSeriesSlug(entry.directory, fileSlug);
      const resolvedOrder = extractOrder(fileSlug, frontmatter.order);

      derivedSeriesSlugs.push(resolvedSeriesSlug);

      if (!resolvedSeriesSlug) {
        errors.push(`Unable to resolve series slug in ${entry.sourcePath}/${fileName}`);
      }

      if (!Number.isFinite(resolvedOrder) || resolvedOrder === Number.MAX_SAFE_INTEGER) {
        errors.push(`Unable to resolve part order in ${entry.sourcePath}/${fileName}`);
      }
    }
  }

  for (const domainId of getSeriesDomainIds()) {
    const domainDirectory = path.join(process.cwd(), "content", "series", domainId);
    if (!fs.existsSync(domainDirectory)) {
      errors.push(`Missing domain directory: ${domainId}`);
      continue;
    }

    const expectedDirectories = new Set(
      manifest.series
        .filter((entry) => entry.domainId === domainId)
        .map((entry) => entry.directory),
    );

    const actualDirectories = fs
      .readdirSync(domainDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const directory of actualDirectories) {
      if (!expectedDirectories.has(directory)) {
        errors.push(`Unregistered series directory: ${domainId}/${directory}`);
      }
    }
  }

  const actualBucketIds = fs
    .readdirSync(path.join(process.cwd(), "content", "series"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(process.cwd(), "content", "series", entry.name, "manifest.json")))
    .map((entry) => entry.name);

  for (const bucketId of actualBucketIds) {
    if (!expectedBucketIds.has(bucketId)) {
      errors.push(`Bucket exists without matching section id: ${bucketId}`);
    }
  }

  if (errors.length > 0) {
    fail(errors);
  }

  console.log("Series structure audit passed.");
  console.log(`- Sections: ${manifest.sections.length}`);
  console.log(`- Series: ${manifest.series.length}`);
}

run();
