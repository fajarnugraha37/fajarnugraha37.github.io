import fs from "fs/promises";
import path from "path";

interface ContentRoutePageGroup {
  label: string;
  paths: string[];
}

export const CONTENT_ROUTE_PAGE_GROUPS: ContentRoutePageGroup[] = [
  {
    label: "series pages",
    paths: [
      path.join(process.cwd(), "app", "series", "page.tsx"),
      path.join(process.cwd(), "app", "series", "[seriesSlug]", "page.tsx"),
      path.join(process.cwd(), "app", "series", "[seriesSlug]", "[partSlug]", "page.tsx"),
    ],
  },
  {
    label: "blog pages",
    paths: [
      path.join(process.cwd(), "app", "blogs", "page.tsx"),
      path.join(process.cwd(), "app", "blogs", "[slug]", "page.tsx"),
    ],
  },
];

function getHiddenPagePath(activePath: string) {
  return activePath.replace(`${path.sep}page.tsx`, `${path.sep}_page.tsx`);
}

export async function toggleContentRoutePages(isWriteMode: boolean) {
  for (const group of CONTENT_ROUTE_PAGE_GROUPS) {
    try {
      for (const activePath of group.paths) {
        const hiddenPath = getHiddenPagePath(activePath);
        const activeExists = await fs.stat(activePath).then(() => true).catch(() => false);
        const hiddenExists = await fs.stat(hiddenPath).then(() => true).catch(() => false);

        if (isWriteMode) {
          if (hiddenExists && !activeExists) {
            console.log(`Restoring ${hiddenPath} to ${activePath}`);
            await fs.rename(hiddenPath, activePath);
          }
        } else if (activeExists) {
          console.log(`Hiding ${activePath} to ${hiddenPath} for Read Mode`);
          await fs.rename(activePath, hiddenPath);
        }
      }
    } catch (error) {
      console.error(`Failed to toggle ${group.label}:`, error);
    }
  }
}

export async function restoreContentRoutePages() {
  for (const group of CONTENT_ROUTE_PAGE_GROUPS) {
    for (const activePath of group.paths) {
      const hiddenPath = getHiddenPagePath(activePath);
      const activeExists = await fs.stat(activePath).then(() => true).catch(() => false);
      const hiddenExists = await fs.stat(hiddenPath).then(() => true).catch(() => false);

      if (hiddenExists && !activeExists) {
        console.log(`Restoring ${hiddenPath} back to ${activePath}`);
        await fs.rename(hiddenPath, activePath);
      }
    }
  }
}
