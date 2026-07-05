import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const SERIES_DIR = path.join(process.cwd(), "out", "series");
const REPORT_JSON_PATH = path.join(CACHE_DIR, "series-budget-report.json");

interface FileStatEntry {
  relativePath: string;
  size: number;
}

interface SeriesGroupSummary {
  key: string;
  totalBytes: number;
  totalFiles: number;
  htmlFiles: number;
}

interface BudgetReport {
  generatedAt: string;
  seriesDir: string;
  exists: boolean;
  totalFiles: number;
  totalBytes: number;
  totalHtmlFiles: number;
  totalHtmlBytes: number;
  largestHtmlPage: FileStatEntry | null;
  heaviestSeries: SeriesGroupSummary | null;
  topLargestHtmlPages: FileStatEntry[];
  topHeaviestSeries: SeriesGroupSummary[];
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
    const [seriesSlug] = file.relativePath.split("/");
    if (!seriesSlug) {
      continue;
    }

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

function readNumberEnv(name: string) {
  const raw = process.env[name];
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function toBytesFromMb(value: number | null) {
  return value === null ? null : value * 1024 * 1024;
}

function toBytesFromKb(value: number | null) {
  return value === null ? null : value * 1024;
}

function logReport(report: BudgetReport) {
  console.log("Series budget audit complete.");
  console.log(`- Series directory: ${report.seriesDir}`);
  console.log(`- Exists: ${report.exists ? "yes" : "no"}`);

  if (!report.exists) {
    return;
  }

  console.log(`- Total files: ${report.totalFiles}`);
  console.log(`- Total size: ${formatBytes(report.totalBytes)}`);
  console.log(`- HTML files: ${report.totalHtmlFiles}`);
  console.log(`- HTML total size: ${formatBytes(report.totalHtmlBytes)}`);

  if (report.largestHtmlPage) {
    console.log(
      `- Largest HTML page: ${report.largestHtmlPage.relativePath} (${formatBytes(report.largestHtmlPage.size)})`,
    );
  }

  if (report.heaviestSeries) {
    console.log(
      `- Heaviest series: ${report.heaviestSeries.key} (${formatBytes(report.heaviestSeries.totalBytes)})`,
    );
  }
}

async function buildReport(): Promise<BudgetReport> {
  const exists = await directoryExists(SERIES_DIR);
  if (!exists) {
    return {
      generatedAt: new Date().toISOString(),
      seriesDir: SERIES_DIR,
      exists: false,
      totalFiles: 0,
      totalBytes: 0,
      totalHtmlFiles: 0,
      totalHtmlBytes: 0,
      largestHtmlPage: null,
      heaviestSeries: null,
      topLargestHtmlPages: [],
      topHeaviestSeries: [],
    };
  }

  const files = await walkFiles(SERIES_DIR);
  const htmlFiles = files.filter((file) => file.relativePath.endsWith(".html"));
  const topLargestHtmlPages = topEntries(htmlFiles, 20);
  const perSeries = buildPerSeriesSummaries(files);

  return {
    generatedAt: new Date().toISOString(),
    seriesDir: SERIES_DIR,
    exists: true,
    totalFiles: files.length,
    totalBytes: sumBytes(files),
    totalHtmlFiles: htmlFiles.length,
    totalHtmlBytes: sumBytes(htmlFiles),
    largestHtmlPage: topLargestHtmlPages[0] || null,
    heaviestSeries: perSeries[0] || null,
    topLargestHtmlPages,
    topHeaviestSeries: perSeries.slice(0, 20),
  };
}

function evaluateBudgets(report: BudgetReport) {
  const failures: string[] = [];

  const totalBudget = toBytesFromMb(readNumberEnv("SERIES_TOTAL_BUDGET_MB"));
  const totalHtmlBudget = toBytesFromMb(readNumberEnv("SERIES_HTML_TOTAL_BUDGET_MB"));
  const largestPageBudget = toBytesFromKb(readNumberEnv("SERIES_LARGEST_PAGE_BUDGET_KB"));
  const largestSeriesBudget = toBytesFromMb(readNumberEnv("SERIES_LARGEST_SERIES_BUDGET_MB"));

  if (totalBudget !== null && report.totalBytes > totalBudget) {
    failures.push(
      `Total series export ${formatBytes(report.totalBytes)} exceeds budget ${formatBytes(totalBudget)}`,
    );
  }

  if (totalHtmlBudget !== null && report.totalHtmlBytes > totalHtmlBudget) {
    failures.push(
      `Total series HTML ${formatBytes(report.totalHtmlBytes)} exceeds budget ${formatBytes(totalHtmlBudget)}`,
    );
  }

  if (
    largestPageBudget !== null &&
    report.largestHtmlPage &&
    report.largestHtmlPage.size > largestPageBudget
  ) {
    failures.push(
      `Largest series HTML page ${report.largestHtmlPage.relativePath} (${formatBytes(report.largestHtmlPage.size)}) exceeds budget ${formatBytes(largestPageBudget)}`,
    );
  }

  if (
    largestSeriesBudget !== null &&
    report.heaviestSeries &&
    report.heaviestSeries.totalBytes > largestSeriesBudget
  ) {
    failures.push(
      `Heaviest series ${report.heaviestSeries.key} (${formatBytes(report.heaviestSeries.totalBytes)}) exceeds budget ${formatBytes(largestSeriesBudget)}`,
    );
  }

  return failures;
}

async function run() {
  const report = await buildReport();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(REPORT_JSON_PATH, JSON.stringify(report, null, 2));

  logReport(report);
  console.log(`- JSON report: ${REPORT_JSON_PATH}`);

  if (!report.exists) {
    console.warn("Series export directory is missing. Budget enforcement skipped.");
    return;
  }

  const failures = evaluateBudgets(report);
  if (failures.length === 0) {
    console.log("- Budget status: pass");
    return;
  }

  console.error("- Budget status: fail");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }

  process.exitCode = 1;
}

run().catch((error) => {
  console.error("Series budget audit failed:", error);
  process.exitCode = 1;
});
