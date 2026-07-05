import path from "path";
import { buildStaticBlogsOutput } from "./build-static-blogs";
import { buildStaticSeriesOutput } from "./build-static-series-preview";

export async function buildStaticContentOutputs({
  outDir = path.join(process.cwd(), "out"),
  writeSummary = false,
}: {
  outDir?: string;
  writeSummary?: boolean;
}) {
  await buildStaticBlogsOutput({
    outputDir: path.join(outDir, "blogs"),
    outputLabel: "Live static blogs export ready",
    writeSummary,
    includeIndexPage: false,
    resetOutputDir: false,
    shellOutputRoot: outDir,
  });

  await buildStaticSeriesOutput({
    outputDir: path.join(outDir, "series"),
    outputLabel: "Live static series export ready",
    writeSummary,
    includeCatalogIndex: false,
    includeSeriesIndex: false,
    resetOutputDir: false,
    shellOutputRoot: outDir,
  });
}
