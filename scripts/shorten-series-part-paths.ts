import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";

const SERIES_ROOT = path.join(process.cwd(), "content", "series");
const DEFAULT_PATH_LIMIT = 240;

interface SeriesFrontmatter {
  order?: number | string;
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

async function run() {
  const pathLimit = Number(process.env.SERIES_PATH_LIMIT || DEFAULT_PATH_LIMIT);
  const files = await collectSeriesFiles(SERIES_ROOT);
  const renamePlans: Array<{
    currentPath: string;
    currentSlug: string;
    targetPath: string;
    targetFileName: string;
    nextRaw: string;
  }> = [];

  for (const filePath of files) {
    if (path.resolve(filePath).length < pathLimit) {
      continue;
    }

    const raw = await fs.readFile(toExtendedPath(filePath), "utf8");
    const { data } = parseContentFrontmatter(raw);
    const frontmatter = data as SeriesFrontmatter;
    const currentFileName = path.basename(filePath);
    const currentSlug = currentFileName.replace(/\.mdx$/, "");
    const order = extractOrder(currentSlug, frontmatter.order);

    if (!Number.isFinite(order) || order === Number.MAX_SAFE_INTEGER) {
      throw new Error(`Unable to infer order for ${filePath}`);
    }

    const orderLabel = String(order).padStart(3, "0");
    const directory = path.dirname(filePath);
    let candidateFileName = `part-${orderLabel}.mdx`;
    let collisionCounter = 2;

    while (
      existsSync(toExtendedPath(path.join(directory, candidateFileName))) &&
      path.join(directory, candidateFileName) !== filePath
    ) {
      candidateFileName = `part-${orderLabel}-${collisionCounter}.mdx`;
      collisionCounter += 1;
    }

    const targetPath = path.join(directory, candidateFileName);
    if (targetPath === filePath) {
      continue;
    }

    renamePlans.push({
      currentPath: filePath,
      currentSlug,
      targetPath,
      targetFileName: candidateFileName,
      nextRaw: raw,
    });
  }

  for (const plan of renamePlans) {
    if (plan.currentPath !== plan.targetPath) {
      await fs.rename(toExtendedPath(plan.currentPath), toExtendedPath(plan.targetPath));
    }

    await fs.writeFile(toExtendedPath(plan.targetPath), plan.nextRaw, "utf8");
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
