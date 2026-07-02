import path from "path";
import { BlogMetadata, SeriesPartSummary, SeriesSummary } from "../types";

export const CONTENT_CACHE_DIR = path.join(process.cwd(), ".cache");
export const BLOG_INDEX_PATH = path.join(CONTENT_CACHE_DIR, "blog-index.json");
export const SERIES_INDEX_PATH = path.join(CONTENT_CACHE_DIR, "series-index.json");

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
