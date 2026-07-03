import path from "path";
import { createHash } from "crypto";
import { BlogMetadata, SeriesPartSummary, SeriesSummary, TocHeading } from "../types";

export const CONTENT_CACHE_DIR = path.join(process.cwd(), ".cache");
export const BLOG_INDEX_PATH = path.join(CONTENT_CACHE_DIR, "blog-index.json");
export const SERIES_INDEX_PATH = path.join(CONTENT_CACHE_DIR, "series-index.json");
export const COMPILED_MDX_CACHE_DIR = path.join(CONTENT_CACHE_DIR, "compiled-mdx");
export const BLOG_COMPILED_MDX_CACHE_DIR = path.join(COMPILED_MDX_CACHE_DIR, "blogs");
export const SERIES_COMPILED_MDX_CACHE_DIR = path.join(COMPILED_MDX_CACHE_DIR, "series");
export const COMPILED_MDX_CACHE_VERSION = 3;

export interface BlogIndexEntry extends BlogMetadata {
  fileName: string;
  fingerprint: string;
  contentHash: string;
}

export interface BlogIndexData {
  generatedAt: string;
  items: BlogIndexEntry[];
}

export interface SeriesIndexPartEntry extends SeriesPartSummary {
  fileName: string;
  fingerprint: string;
  contentHash: string;
}

export interface SeriesIndexEntry {
  directorySlug: string;
  publicSlug: string;
  summary: SeriesSummary;
  parts: SeriesIndexPartEntry[];
}

export interface SeriesIndexData {
  generatedAt: string;
  manifestHash: string;
  entries: SeriesIndexEntry[];
}

export interface CompiledMdxCacheEntry {
  version: number;
  fingerprint: string;
  compiledSource: string;
  scope: Record<string, unknown>;
  frontmatter: Record<string, unknown>;
  headings: TocHeading[];
}

function getCompiledMdxCacheFileName(key: string) {
  return createHash("sha1").update(key).digest("hex");
}

export function getBlogCompiledMdxCachePath(slug: string) {
  const fileName = getCompiledMdxCacheFileName(`blog:${slug}`);
  return path.join(BLOG_COMPILED_MDX_CACHE_DIR, fileName.slice(0, 2), `${fileName}.json`);
}

export function getSeriesCompiledMdxCachePath(seriesSlug: string, partSlug: string) {
  const fileName = getCompiledMdxCacheFileName(`series:${seriesSlug}:${partSlug}`);
  return path.join(SERIES_COMPILED_MDX_CACHE_DIR, fileName.slice(0, 2), `${fileName}.json`);
}
