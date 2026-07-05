import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const NEXT_SERIES_DIR = path.join(process.cwd(), "out", "series");
<<<<<<< HEAD
const PREVIEW_SERIES_DIR = path.join(process.cwd(), ".cache", "static-series-preview", "series");
=======
const PREVIEW_SERIES_DIR = path.join(process.cwd(), ".cache", "static-series-preview");
>>>>>>> 07-optimize-mdx-rendering
const REPORT_JSON_PATH = path.join(CACHE_DIR, "series-output-comparison.json");
const REPORT_MD_PATH = path.join(CACHE_DIR, "series-output-comparison.md");

interface FileStatEntry {
  relativePath: string;
  size: number;
}

interface TargetAudit {
  label: string;
  baseDir: string;
  exists: boolean;
  totalFiles: number;
  totalBytes: number;
  totalHtmlFiles: number;
  topLargestFiles: FileStatEntry[];
  topLargestHtmlPages: FileStatEntry[];
  perSeries: SeriesGroupSummary[];
}

interface SeriesGroupSummary {
  key: string;
  totalBytes: number;
  totalFiles: number;
  htmlFiles: number;
}

interface SeriesDeltaSummary {
  seriesSlug: string;
  nextBytes: number;
  previewBytes: number;
  nextHtmlFiles: number;
  previewHtmlFiles: number;
  byteDelta: number;
  reductionRatio: number | null;
}

interface ComparisonReport {
  generatedAt: string;
  nextExport: TargetAudit;
  staticPreview: TargetAudit;
  perSeriesDelta: SeriesDeltaSummary[];
}

async function directoryExists(dirPath: string) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function walkFiles(dir: string, baseDir = dir): Promise<FileStatEntry[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walkFiles(fullPath, baseDir);
      }

      if (!entry.isFile()) {
        return [];
      }

      const stat = await fs.stat(fullPath);
      return [
        {
          relativePath: path.relative(baseDir, fullPath).replace(/\\/g, "/"),
          size: stat.size,
        },
      ];
    }),
  );

  return nested.flat();
}

function sumBytes(files: FileStatEntry[]) {
  return files.reduce((total, file) => total + file.size, 0);
}

function topEntries(files: FileStatEntry[], limit: number) {
  return [...files].sort((left, right) => right.size - left.size).slice(0, limit);
}

function buildPerSeriesSummaries(files: FileStatEntry[]) {
  const groups = new Map<string, SeriesGroupSummary>();

  for (const file of files) {
<<<<<<< HEAD
    const [seriesSlug] = file.relativePath.split("/");
    if (!seriesSlug) {
      continue;
    }
=======
    const segments = file.relativePath.split("/");
    if (segments.length < 2) {
      continue;
    }
    const seriesSlug =
      segments[0] === "series" && segments.length >= 3 ? segments[1] : segments[0];
>>>>>>> 07-optimize-mdx-rendering

    const current = groups.get(seriesSlug) || {
      key: seriesSlug,
      totalBytes: 0,
      totalFiles: 0,
      htmlFiles: 0,
    };

    current.totalBytes += file.size;
    current.totalFiles += 1;
    if (file.relativePath.endsWith(".html")) {
      current.htmlFiles += 1;
    }

    groups.set(seriesSlug, current);
  }

  return [...groups.values()].sort((left, right) => right.totalBytes - left.totalBytes);
}

async function auditTarget(label: string, baseDir: string): Promise<TargetAudit> {
  const exists = await directoryExists(baseDir);
  if (!exists) {
    return {
      label,
      baseDir,
      exists: false,
      totalFiles: 0,
      totalBytes: 0,
      totalHtmlFiles: 0,
      topLargestFiles: [],
      topLargestHtmlPages: [],
      perSeries: [],
    };
  }

  const files = await walkFiles(baseDir);
  const htmlFiles = files.filter((file) => file.relativePath.endsWith(".html"));

  return {
    label,
    baseDir,
    exists: true,
    totalFiles: files.length,
    totalBytes: sumBytes(files),
    totalHtmlFiles: htmlFiles.length,
    topLargestFiles: topEntries(files, 20),
    topLargestHtmlPages: topEntries(htmlFiles, 20),
    perSeries: buildPerSeriesSummaries(files),
  };
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function buildDelta(nextExport: TargetAudit, staticPreview: TargetAudit) {
  const seriesSlugs = new Set([
    ...nextExport.perSeries.map((entry) => entry.key),
    ...staticPreview.perSeries.map((entry) => entry.key),
  ]);

  const nextBySlug = new Map(nextExport.perSeries.map((entry) => [entry.key, entry]));
  const previewBySlug = new Map(staticPreview.perSeries.map((entry) => [entry.key, entry]));

  return [...seriesSlugs]
    .map((seriesSlug) => {
      const nextEntry = nextBySlug.get(seriesSlug);
      const previewEntry = previewBySlug.get(seriesSlug);
      const nextBytes = nextEntry?.totalBytes || 0;
      const previewBytes = previewEntry?.totalBytes || 0;
      const byteDelta = previewBytes - nextBytes;
      const reductionRatio =
        nextBytes > 0 ? Number(((nextBytes - previewBytes) / nextBytes).toFixed(4)) : null;

      return {
        seriesSlug,
        nextBytes,
        previewBytes,
        nextHtmlFiles: nextEntry?.htmlFiles || 0,
        previewHtmlFiles: previewEntry?.htmlFiles || 0,
        byteDelta,
        reductionRatio,
      } satisfies SeriesDeltaSummary;
    })
    .sort((left, right) => {
      const leftSavings = left.nextBytes - left.previewBytes;
      const rightSavings = right.nextBytes - right.previewBytes;
      return rightSavings - leftSavings;
    });
}

function renderTargetSummary(target: TargetAudit) {
  const lines: string[] = [];
  lines.push(`## ${target.label}`);
  lines.push("");
  lines.push(`- Directory: \`${target.baseDir}\``);
  lines.push(`- Exists: ${target.exists ? "yes" : "no"}`);

  if (!target.exists) {
    lines.push("");
    return lines.join("\n");
  }

  lines.push(`- Total Files: ${target.totalFiles}`);
  lines.push(`- Total Size: ${formatBytes(target.totalBytes)}`);
  lines.push(`- HTML Files: ${target.totalHtmlFiles}`);
  lines.push("");
  lines.push("### Largest HTML Pages");
  lines.push("");
  for (const file of target.topLargestHtmlPages.slice(0, 10)) {
    lines.push(`- \`${file.relativePath}\`: ${formatBytes(file.size)}`);
  }
  lines.push("");
  lines.push("### Heaviest Series");
  lines.push("");
  for (const group of target.perSeries.slice(0, 10)) {
    lines.push(
      `- \`${group.key}\`: ${formatBytes(group.totalBytes)} (${group.totalFiles} files, ${group.htmlFiles} html)`,
    );
  }
  lines.push("");

  return lines.join("\n");
}

function renderDeltaSummary(perSeriesDelta: SeriesDeltaSummary[]) {
  const lines: string[] = [];
  lines.push("## Series Delta");
  lines.push("");

  if (perSeriesDelta.length === 0) {
    lines.push("- No series routes available to compare.");
    lines.push("");
    return lines.join("\n");
  }

  for (const entry of perSeriesDelta.slice(0, 20)) {
    const ratioLabel =
      entry.reductionRatio === null
        ? "n/a"
        : `${(entry.reductionRatio * 100).toFixed(2)}% smaller`;
    lines.push(
      `- \`${entry.seriesSlug}\`: next=${formatBytes(entry.nextBytes)}, preview=${formatBytes(entry.previewBytes)}, delta=${formatBytes(entry.byteDelta)}, ${ratioLabel}`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderMarkdownReport(report: ComparisonReport) {
  const lines: string[] = [];
  lines.push("# Series Output Comparison");
  lines.push("");
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push(renderTargetSummary(report.nextExport));
  lines.push(renderTargetSummary(report.staticPreview));
  lines.push(renderDeltaSummary(report.perSeriesDelta));
  return lines.join("\n");
}

function logSummary(report: ComparisonReport) {
  console.log("Series output comparison complete.");
  console.log(
    `- Next export: ${report.nextExport.exists ? formatBytes(report.nextExport.totalBytes) : "missing"}`,
  );
  console.log(
    `- Static preview: ${report.staticPreview.exists ? formatBytes(report.staticPreview.totalBytes) : "missing"}`,
  );

  const topDelta = report.perSeriesDelta[0];
  if (topDelta) {
    console.log(
      `- Largest savings candidate: ${topDelta.seriesSlug} (${formatBytes(topDelta.nextBytes - topDelta.previewBytes)})`,
    );
  }

  console.log(`- JSON report: ${REPORT_JSON_PATH}`);
  console.log(`- Markdown report: ${REPORT_MD_PATH}`);
}

async function run() {
  const [nextExport, staticPreview] = await Promise.all([
    auditTarget("Next Export Series", NEXT_SERIES_DIR),
    auditTarget("Static Preview Series", PREVIEW_SERIES_DIR),
  ]);

  const report: ComparisonReport = {
    generatedAt: new Date().toISOString(),
    nextExport,
    staticPreview,
    perSeriesDelta: buildDelta(nextExport, staticPreview),
  };

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(REPORT_JSON_PATH, JSON.stringify(report, null, 2));
  await fs.writeFile(REPORT_MD_PATH, renderMarkdownReport(report));

  logSummary(report);
}

run().catch((error) => {
  console.error("Series output comparison failed:", error);
  process.exitCode = 1;
});
