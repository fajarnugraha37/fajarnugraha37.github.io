import fs from "fs/promises";
import path from "path";
import { parseContentFrontmatter } from "../lib/frontmatter";
import { buildCompiledMdxCacheEntry } from "../lib/compiled-mdx-cache";
import {
  SERIES_ROOT_DIRECTORY,
  getSeriesContentDirectory,
  loadAggregatedSeriesManifest,
} from "../lib/series-manifest";
import { prepareMdxSourceForCompile } from "../lib/mdx";

const REPORT_PATH = path.join(process.cwd(), ".cache", "onboard-sanitizer-report.json");

interface SanitizerReportEntry {
  sourcePath: string;
  fileName: string;
  title: string;
  status: "ok" | "failed";
  fingerprint: string;
  error?: string;
}

function toTitleCase(input: string) {
  return input
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

async function main() {
  const manifest = loadAggregatedSeriesManifest();
  const onboardSeries = manifest.series.filter(
    (entry) => entry.sourcePath === "onboard" || entry.sourcePath.startsWith("onboard/"),
  );

  const report: SanitizerReportEntry[] = [];
  let failed = 0;

  for (const seriesEntry of onboardSeries) {
    const directory = getSeriesContentDirectory(seriesEntry.sourcePath);
    const fileNames = (await fs.readdir(directory))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .sort((left, right) => left.localeCompare(right));

    for (const fileName of fileNames) {
      const fullPath = path.join(directory, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const { data, content } = parseContentFrontmatter(raw);
      const frontmatter = data as { title?: string };
      const title = frontmatter.title || toTitleCase(fileName.replace(/\.mdx$/, ""));
      const sanitizedContent = prepareMdxSourceForCompile(content, seriesEntry.sourcePath);

      try {
        await buildCompiledMdxCacheEntry({
          title,
          content: sanitizedContent,
          fingerprint: `${seriesEntry.sourcePath}/${fileName}`,
        });

        report.push({
          sourcePath: seriesEntry.sourcePath,
          fileName,
          title,
          status: "ok",
          fingerprint: `${seriesEntry.sourcePath}/${fileName}`,
        });
      } catch (error) {
        failed += 1;
        report.push({
          sourcePath: seriesEntry.sourcePath,
          fileName,
          title,
          status: "failed",
          fingerprint: `${seriesEntry.sourcePath}/${fileName}`,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await fs.writeFile(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        root: path.relative(process.cwd(), SERIES_ROOT_DIRECTORY).replace(/\\/g, "/"),
        totalSeries: onboardSeries.length,
        totalFiles: report.length,
        failed,
        entries: report,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Onboard sanitizer report written to ${REPORT_PATH}`);

  if (failed > 0) {
    throw new Error(`Onboard sanitizer validation failed for ${failed} file(s).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
