import fs from "fs/promises";
import path from "path";
import { buildStaticContentOutputs } from "./build-static-content";
import { restoreContentRoutePages } from "./content-route-pages";

const API_DIR = path.join(process.cwd(), "app/api");
const OUT_DIR = path.join(process.cwd(), "out");
async function getApiRoutes(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          return getApiRoutes(fullPath);
        } else if (entry.name === "route.ts" || entry.name === "_route.ts") {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  } catch (e) {
    return [];
  }
}

async function run() {
  console.log("Starting post-build...");
  let exportError: unknown = null;

  try {
    const isWriteMode = process.env.NEXT_PUBLIC_APP_MODE === "write";
    const postBuildMode = process.env.POST_BUILD_MODE || "full";
    if (!isWriteMode && postBuildMode === "full") {
      const outExists = await fs.stat(OUT_DIR).then(() => true).catch(() => false);
      if (outExists) {
        await buildStaticContentOutputs({
          outDir: OUT_DIR,
          writeSummary: false,
        });
      }
    }
  } catch (error) {
    console.error("Failed to build static content outputs:", error);
    exportError = error;
  }

  try {
    const routePaths = await getApiRoutes(API_DIR);

    for (const routePath of routePaths) {
      const activePath = routePath.endsWith("_route.ts")
        ? routePath.replace("_route.ts", "route.ts")
        : routePath;

      const hiddenPath = activePath.replace("route.ts", "_route.ts");

      const activeExists = await fs.stat(activePath).then(() => true).catch(() => false);
      const hiddenExists = await fs.stat(hiddenPath).then(() => true).catch(() => false);

      if (hiddenExists && !activeExists) {
        console.log(`Restoring ${hiddenPath} back to ${activePath}`);
        await fs.rename(hiddenPath, activePath);
      }
    }
  } catch (error) {
    console.error("Failed to restore API routes:", error);
    if (!exportError) {
      exportError = error;
    }
  }

  try {
    await restoreContentRoutePages();
  } catch (error) {
    console.error("Failed to restore content route pages:", error);
    if (!exportError) {
      exportError = error;
    }
  }

  if (exportError) {
    console.error("Post-build failed:", exportError);
    process.exitCode = 1;
  }
}

run();
