import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";

const SERIES_ROOT = path.join(process.cwd(), "content", "series");
const DEFAULT_PATH_LIMIT = 240;

interface SeriesFrontmatter {
  order?: number | string;
  title?: string;
  partTitle?: string;
  series?: string;
}

function toExtendedPath(targetPath: string) {
  if (process.platform !== "win32") {
    return targetPath;
  }

  if (targetPath.startsWith("\\\\?\\")) {
    return targetPath;
  }

  return `\\\\?\\${path.resolve(targetPath)}`;
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

async function collectSeriesFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectSeriesFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return nested.flat();
}

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function trimTrailingSeparator(value: string) {
  return value.replace(/-+$/g, "");
}

function inferPrefixFromSiblingFiles(directory: string) {
  const siblingPrefixes = fs
    .readdir(directory, { withFileTypes: true })
    .then((entries) =>
      entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx") && !entry.name.startsWith("lesson-"))
        .map((entry) => entry.name.match(/^(.*)-part-\d+(?:-.+)?\.mdx$/)?.[1])
        .filter((value): value is string => Boolean(value)),
    );

  return siblingPrefixes;
}

function inferPrefixFromDirectoryName(directory: string) {
  return path
    .basename(directory)
    .replace(/-complete$/i, "")
    .replace(/^learn-lang-fe-/i, "learn-frontend-")
    .replace(/^learn-lang-/i, "learn-")
    .replace(/^learn-ling-/i, "learn-");
}

async function inferSeriesFilePrefix(directory: string, frontmatterSeries?: string) {
  const siblingPrefixes = await inferPrefixFromSiblingFiles(directory);
  if (siblingPrefixes.length > 0) {
    const counts = new Map<string, number>();
    for (const prefix of siblingPrefixes) {
      counts.set(prefix, (counts.get(prefix) || 0) + 1);
    }

    return [...counts.entries()].sort((left, right) => right[1] - left[1])[0][0];
  }

  if (frontmatterSeries && /^learn-[a-z0-9-]+$/i.test(frontmatterSeries) && frontmatterSeries.split("-").length >= 3) {
    return frontmatterSeries;
  }

  return inferPrefixFromDirectoryName(directory);
}

function buildCompactFileName(
  directory: string,
  prefix: string,
  orderLabel: string,
  topicSlug: string,
  pathLimit: number,
  existingPath?: string,
) {
  const basePrefix = `${prefix}-part-${orderLabel}`;
  const maxBaseLength = pathLimit - path.resolve(directory).length - 1 - ".mdx".length;

  if (maxBaseLength < basePrefix.length) {
    throw new Error(`Path limit too small to rename files in ${directory}`);
  }

  const topicBudget = Math.max(0, maxBaseLength - basePrefix.length - 1);
  const compactTopic = trimTrailingSeparator(topicSlug.slice(0, topicBudget));
  let candidateBase = compactTopic ? `${basePrefix}-${compactTopic}` : basePrefix;
  let candidateFileName = `${candidateBase}.mdx`;
  let collisionCounter = 2;

  while (
    existsSync(toExtendedPath(path.join(directory, candidateFileName))) &&
    path.join(directory, candidateFileName) !== existingPath
  ) {
    const suffix = `-${collisionCounter}`;
    const collisionTopicBudget = Math.max(0, topicBudget - suffix.length);
    const collisionTopic = trimTrailingSeparator(topicSlug.slice(0, collisionTopicBudget));
    candidateBase = collisionTopic
      ? `${basePrefix}-${collisionTopic}${suffix}`
      : `${basePrefix}${suffix}`;
    candidateFileName = `${candidateBase}.mdx`;
    collisionCounter += 1;
  }

  return candidateFileName;
}

async function run() {
  const pathLimit = Number(process.env.SERIES_PATH_LIMIT || DEFAULT_PATH_LIMIT);
  const files = await collectSeriesFiles(SERIES_ROOT);
  const renamePlans: Array<{
    currentPath: string;
    currentSlug: string;
    targetPath: string;
  }> = [];

  for (const filePath of files) {
    const currentFileName = path.basename(filePath);
    if (!/^(part-\d+(?:-\d+)?|lesson-\d+(?:-.+)?)\.mdx$/i.test(currentFileName)) {
      continue;
    }

    const raw = await fs.readFile(toExtendedPath(filePath), "utf8");
    const { data } = parseContentFrontmatter(raw);
    const frontmatter = data as SeriesFrontmatter;
    const currentSlug = currentFileName.replace(/\.mdx$/, "");
    const order = extractOrder(currentSlug, frontmatter.order);

    if (!Number.isFinite(order) || order === Number.MAX_SAFE_INTEGER) {
      throw new Error(`Unable to infer order for ${filePath}`);
    }

    const orderLabel = String(order).padStart(3, "0");
    const directory = path.dirname(filePath);
    const prefix = await inferSeriesFilePrefix(directory, frontmatter.series);
    const rawTopic = frontmatter.partTitle || frontmatter.title || currentSlug;
    const topicSlug = slugify(rawTopic);
    const candidateFileName = buildCompactFileName(
      directory,
      prefix,
      orderLabel,
      topicSlug,
      pathLimit,
      filePath,
    );
    const targetPath = path.join(directory, candidateFileName);
    if (targetPath === filePath) {
      continue;
    }

    renamePlans.push({
      currentPath: filePath,
      currentSlug,
      targetPath,
    });
  }

  for (const plan of renamePlans) {
    await fs.rename(toExtendedPath(plan.currentPath), toExtendedPath(plan.targetPath));
    console.log(
      `Shortened ${path.relative(process.cwd(), plan.currentPath)} -> ${path.relative(process.cwd(), plan.targetPath)} (slug: ${plan.currentSlug})`,
    );
  }

  console.log(`Shortened ${renamePlans.length} series part file(s).`);
}

run().catch((error) => {
  console.error("Failed to shorten series part paths:", error);
  process.exit(1);
});
