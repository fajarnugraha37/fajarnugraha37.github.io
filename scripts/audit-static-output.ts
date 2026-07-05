import fs from "fs/promises";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "out");
const CACHE_DIR = path.join(process.cwd(), ".cache");
const REPORT_JSON_PATH = path.join(CACHE_DIR, "static-output-audit.json");
const REPORT_MD_PATH = path.join(CACHE_DIR, "static-output-audit.md");

interface FileStatEntry {
  relativePath: string;
  size: number;
}

interface GroupSummary {
  key: string;
  totalBytes: number;
  fileCount: number;
  htmlCount: number;
}

interface StaticOutputAuditReport {
  generatedAt: string;
  outDir: string;
  totalFiles: number;
  totalBytes: number;
  totalHtmlFiles: number;
  topLevelDirectories: GroupSummary[];
  topLargestFiles: FileStatEntry[];
  topLargestHtmlPages: FileStatEntry[];
  seriesRouteGroups: GroupSummary[];
  blogRouteGroups: GroupSummary[];
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

function buildGroupSummaries(
  files: FileStatEntry[],
  resolveKey: (relativePath: string) => string | null,
): GroupSummary[] {
  const groups = new Map<string, GroupSummary>();

  for (const file of files) {
    const key = resolveKey(file.relativePath);
    if (!key) {
      continue;
    }

    const current = groups.get(key) || {
      key,
      totalBytes: 0,
      fileCount: 0,
      htmlCount: 0,
    };

    current.totalBytes += file.size;
    current.fileCount += 1;
    if (file.relativePath.endsWith(".html")) {
      current.htmlCount += 1;
    }

    groups.set(key, current);
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

function renderMarkdownReport(report: StaticOutputAuditReport) {
  const lines: string[] = [];

  lines.push("# Static Output Audit");
  lines.push("");
  lines.push(`- Generated: ${report.generatedAt}`);
  lines.push(`- Output Directory: \`${report.outDir}\``);
  lines.push(`- Total Files: ${report.totalFiles}`);
  lines.push(`- Total Size: ${formatBytes(report.totalBytes)}`);
  lines.push(`- HTML Files: ${report.totalHtmlFiles}`);
  lines.push("");

  lines.push("## Top-Level Directories");
  lines.push("");
  for (const group of report.topLevelDirectories.slice(0, 20)) {
    lines.push(
      `- \`${group.key}\`: ${formatBytes(group.totalBytes)} (${group.fileCount} files, ${group.htmlCount} html)`,
    );
  }
  lines.push("");

  lines.push("## Largest Files");
  lines.push("");
  for (const file of report.topLargestFiles) {
    lines.push(`- \`${file.relativePath}\`: ${formatBytes(file.size)}`);
  }
  lines.push("");

  lines.push("## Largest HTML Pages");
  lines.push("");
  for (const file of report.topLargestHtmlPages) {
    lines.push(`- \`${file.relativePath}\`: ${formatBytes(file.size)}`);
  }
  lines.push("");

  lines.push("## Series Route Groups");
  lines.push("");
  for (const group of report.seriesRouteGroups.slice(0, 20)) {
    lines.push(
      `- \`${group.key}\`: ${formatBytes(group.totalBytes)} (${group.fileCount} files, ${group.htmlCount} html)`,
    );
  }
  lines.push("");

  lines.push("## Blog Route Groups");
  lines.push("");
  for (const group of report.blogRouteGroups.slice(0, 20)) {
    lines.push(
      `- \`${group.key}\`: ${formatBytes(group.totalBytes)} (${group.fileCount} files, ${group.htmlCount} html)`,
    );
  }
  lines.push("");

  return lines.join("\n");
}

function logSummary(report: StaticOutputAuditReport) {
  console.log("Static output audit complete.");
  console.log(`- Total files: ${report.totalFiles}`);
  console.log(`- Total size: ${formatBytes(report.totalBytes)}`);
  console.log(`- HTML files: ${report.totalHtmlFiles}`);

  const largestHtml = report.topLargestHtmlPages[0];
  if (largestHtml) {
    console.log(
      `- Largest HTML page: ${largestHtml.relativePath} (${formatBytes(largestHtml.size)})`,
    );
  }

  const largestSeriesGroup = report.seriesRouteGroups[0];
  if (largestSeriesGroup) {
    console.log(
      `- Heaviest series group: ${largestSeriesGroup.key} (${formatBytes(largestSeriesGroup.totalBytes)})`,
    );
  }

  console.log(`- JSON report: ${REPORT_JSON_PATH}`);
  console.log(`- Markdown report: ${REPORT_MD_PATH}`);
}

async function run() {
  try {
    await fs.access(OUT_DIR);
  } catch {
    console.warn(`Static output directory not found at ${OUT_DIR}. Skipping audit.`);
    return;
  }

  const files = await walkFiles(OUT_DIR);
  const htmlFiles = files.filter((file) => file.relativePath.endsWith(".html"));

  const report: StaticOutputAuditReport = {
    generatedAt: new Date().toISOString(),
    outDir: OUT_DIR,
    totalFiles: files.length,
    totalBytes: sumBytes(files),
    totalHtmlFiles: htmlFiles.length,
    topLevelDirectories: buildGroupSummaries(files, (relativePath) => {
      const [segment] = relativePath.split("/");
      return segment || "(root)";
    }),
    topLargestFiles: topEntries(files, 20),
    topLargestHtmlPages: topEntries(htmlFiles, 20),
    seriesRouteGroups: buildGroupSummaries(files, (relativePath) => {
      const segments = relativePath.split("/");
      if (segments[0] !== "series" || segments.length < 2) {
        return null;
      }

      return `series/${segments[1]}`;
    }),
    blogRouteGroups: buildGroupSummaries(files, (relativePath) => {
      const segments = relativePath.split("/");
      if (segments[0] !== "blogs" || segments.length < 2) {
        return null;
      }

      return `blogs/${segments[1]}`;
    }),
  };

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(REPORT_JSON_PATH, JSON.stringify(report, null, 2));
  await fs.writeFile(REPORT_MD_PATH, renderMarkdownReport(report));

  logSummary(report);
}

run().catch((error) => {
  console.error("Static output audit failed:", error);
  process.exitCode = 1;
});
