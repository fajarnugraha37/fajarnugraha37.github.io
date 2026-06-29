/**
 * Global Type Definitions
 * 
 * Central source of truth for all domain entities, database states,
 * and common UI patterns.
 */

// --- Blog & Content ---

export interface BlogMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
}

export interface ContentStats {
  charCount: number;
  wordCount: number;
  readingTime: number;
}

export interface Blog extends BlogMetadata {
  content: string;
  stats: ContentStats;
}

export interface SeriesPartMetadata extends BlogMetadata {
  seriesSlug: string;
  seriesTitle: string;
  order: number;
  partTitle?: string;
}

export interface SeriesPart extends SeriesPartMetadata {
  content: string;
  stats: ContentStats;
}

export interface SeriesSummary {
  seriesSlug: string;
  seriesTitle: string;
  description: string;
  tags: string[];
  totalParts: number;
  totalReadingTime: number;
  firstPartSlug: string;
}

export interface SeriesDetail {
  summary: SeriesSummary;
  parts: SeriesPart[];
}

export interface SeriesNavLink {
  slug: string;
  title: string;
  order: number;
}

export interface SeriesManifestSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  order: number;
}

export interface SeriesManifestEntry {
  slug: string;
  section: string;
  order: number;
  featured?: boolean;
  featuredLabel?: string;
  hidden?: boolean;
}

export interface SeriesCatalogItem extends SeriesSummary {
  sectionId: string;
  seriesOrder: number;
  featured: boolean;
  featuredLabel?: string;
}

export interface SeriesCatalogSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  order: number;
  featured: SeriesCatalogItem[];
  items: SeriesCatalogItem[];
}

export type AudioContentKind = "blog" | "series-part";

export interface AudioManifestEntry {
  id: string;
  kind: AudioContentKind;
  title: string;
  description: string;
  audioSrc: string;
  durationSeconds: number;
  voice: string;
  sourceHash: string;
  generatedAt: string;
  textLength: number;
  wordCount: number;
  slug?: string;
  seriesSlug?: string;
  partSlug?: string;
}

export interface AudioManifest {
  generatedAt: string;
  entries: AudioManifestEntry[];
}

export interface TocHeading {
  level: number;
  text: string;
  id: string;
  children: TocHeading[];
}

// --- Professional & Academic ---

export interface Experience {
  year: string;
  company: string;
  role: string;
  descriptions: string[];
  tech: string[];
}

export interface Education {
  year: string;
  degree: string;
  school: string;
  location: string;
  description: string;
}

export interface ContactLink {
  name: string;
  url: string;
  desc: string;
}

// --- Database & Labs ---

export type DbStatus = "initializing" | "ready" | "error" | "volatile" | "executing";

export interface QueryResult {
  rows: any[];
  result?: any;
}

// --- UI & State ---

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

// --- Lab Specifics ---

export interface LabFile {
  id: string;
  name: string;
  content: string;
  metadata?: {
    slug: string;
    title: string;
    description: string;
    tags: string[];
  };
}

export type ViewMode = "editor" | "split" | "preview";

// --- Assets Picker ---

export type AssetCategory = "img" | "video" | "audio" | "doc";

export interface AssetItem {
  name: string;
  url: string;
  category: AssetCategory;
  size: number;
  lastModified: number;
}
