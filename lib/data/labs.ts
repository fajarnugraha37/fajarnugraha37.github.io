import {
  BarChart3,
  Database,
  FileText,
  Film,
  Languages,
  type LucideIcon,
  Share2,
} from "lucide-react";

export type LabTone = "accent" | "accent-secondary" | "accent-tertiary";

export interface LabCategoryDefinition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface LabDefinition {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  path: string;
  status: string;
  tone: LabTone;
  categoryId: string;
  bestFor: string;
  inputLabel: string;
  badges: string[];
  featuredRank?: number;
  homeRank?: number;
}

export const LAB_CATEGORIES: LabCategoryDefinition[] = [
  {
    id: "data",
    title: "Data Systems",
    subtitle: "Query, model, and inspect structured data.",
    description:
      "Use these labs when you want relational practice, analytical querying, or fast dataset exploration in the browser.",
  },
  {
    id: "knowledge",
    title: "Writing & Knowledge",
    subtitle: "Draft content and navigate connected ideas.",
    description:
      "Choose these modules when your workflow starts from notes, articles, docs, or semantic browsing instead of raw tables.",
  },
  {
    id: "media",
    title: "Media Processing",
    subtitle: "Transform local audio and video files.",
    description:
      "Use this track when the job is conversion, compression, or browser-side signal processing for media assets.",
  },
  {
    id: "ai",
    title: "AI Utilities",
    subtitle: "Run lightweight inference directly on-device.",
    description:
      "Open these labs when you want fast practical AI help without sending content to a remote service.",
  },
];

export const LABS: LabDefinition[] = [
  {
    id: "postgresql",
    name: "SQL LAB.EXE",
    eyebrow: "Relational Practice",
    description:
      "Persistent PostgreSQL WASM node for relational database exploration and repeatable SQL drills.",
    icon: Database,
    path: "/labs/postgresql",
    status: "ONLINE",
    tone: "accent",
    categoryId: "data",
    bestFor: "SQL learning and schema experiments",
    inputLabel: "Tables, inserts, and queries",
    badges: ["LOCAL_ONLY", "PERSISTED", "BEGINNER_FRIENDLY"],
    featuredRank: 1,
    homeRank: 1,
  },
  {
    id: "duckdb",
    name: "OLAP LAB.EXE",
    eyebrow: "Analytical Querying",
    description:
      "OLAP engine powered by DuckDB-WASM for local CSV and Parquet exploration with fast analytical SQL.",
    icon: BarChart3,
    path: "/labs/duckdb",
    status: "STREAMING",
    tone: "accent-secondary",
    categoryId: "data",
    bestFor: "Large-file analytics and profiling",
    inputLabel: "CSV, Parquet, and wide datasets",
    badges: ["FILE_UPLOAD", "ANALYTICS", "HEAVIER_CPU"],
    featuredRank: 2,
    homeRank: 2,
  },
  {
    id: "knowledge-graph",
    name: "BLOG NETWORKS.EXE",
    eyebrow: "Semantic Discovery",
    description:
      "Interactive graph view for browsing semantic relationships across the blog archive and adjacent ideas.",
    icon: Share2,
    path: "/labs/knowledge-graph",
    status: "ACTIVE",
    tone: "accent-tertiary",
    categoryId: "knowledge",
    bestFor: "Finding related posts and clusters",
    inputLabel: "Existing site knowledge graph",
    badges: ["VISUAL_MAP", "DISCOVERY", "ARCHIVE_NATIVE"],
    homeRank: 4,
  },
  {
    id: "markdown",
    name: "MARKDOWN PLAYGROUND.EXE",
    eyebrow: "Writing Sandbox",
    description:
      "Live Markdown editor with preview-first writing, quick formatting loops, and a technical notebook feel.",
    icon: FileText,
    path: "/labs/markdown",
    status: "READY",
    tone: "accent",
    categoryId: "knowledge",
    bestFor: "Drafting docs and notes fast",
    inputLabel: "Markdown text and snippets",
    badges: ["LIVE_PREVIEW", "LOW_FRICTION", "TEXT_FIRST"],
    featuredRank: 3,
    homeRank: 3,
  },
  {
    id: "ffmpeg",
    name: "MEDIA PROCESSOR.EXE",
    eyebrow: "Browser Transcoding",
    description:
      "Client-side media conversion and signal processing using FFmpeg WASM for local files and quick iterations.",
    icon: Film,
    path: "/labs/ffmpeg",
    status: "STANDBY",
    tone: "accent-secondary",
    categoryId: "media",
    bestFor: "Format conversion and compression",
    inputLabel: "Video and audio files",
    badges: ["MEDIA_FILES", "EXPORTS", "HEAVY_CPU"],
    homeRank: 5,
  },
  {
    id: "translate",
    name: "TRANSLATION PLAYGROUND.EXE",
    eyebrow: "Offline Inference",
    description:
      "Client-side neural translation for text passages when you want practical bilingual drafting without a server roundtrip.",
    icon: Languages,
    path: "/labs/translate",
    status: "INFERENCE",
    tone: "accent-tertiary",
    categoryId: "ai",
    bestFor: "Quick bilingual text iteration",
    inputLabel: "Short and medium text passages",
    badges: ["OFFLINE_AI", "TEXT_ONLY", "MEDIUM_CPU"],
    homeRank: 6,
  },
];

export function getFeaturedLabs() {
  return LABS.filter((lab) => typeof lab.featuredRank === "number").sort(
    (left, right) => (left.featuredRank ?? 999) - (right.featuredRank ?? 999),
  );
}

export function getHomepageLabs() {
  return [...LABS].sort((left, right) => (left.homeRank ?? 999) - (right.homeRank ?? 999));
}

export function getLabsByCategory(categoryId: string) {
  return LABS.filter((lab) => lab.categoryId === categoryId);
}

export function getLabToneClasses(tone: LabTone) {
  switch (tone) {
    case "accent-secondary":
      return {
        text: "text-accent-secondary",
        hoverText: "group-hover:text-accent-secondary",
        hoverBorder: "hover:border-accent-secondary/60",
        hoverIconBorder: "group-hover:border-accent-secondary/40",
        chip: "border-accent-secondary/20 bg-accent-secondary/10 text-accent-secondary",
        shadow: "hover:shadow-[0_0_24px_rgba(255,0,127,0.14)]",
      };
    case "accent-tertiary":
      return {
        text: "text-accent-tertiary",
        hoverText: "group-hover:text-accent-tertiary",
        hoverBorder: "hover:border-accent-tertiary/60",
        hoverIconBorder: "group-hover:border-accent-tertiary/40",
        chip: "border-accent-tertiary/20 bg-accent-tertiary/10 text-accent-tertiary",
        shadow: "hover:shadow-[0_0_24px_rgba(0,212,255,0.14)]",
      };
    case "accent":
    default:
      return {
        text: "text-accent",
        hoverText: "group-hover:text-accent",
        hoverBorder: "hover:border-accent/60",
        hoverIconBorder: "group-hover:border-accent/40",
        chip: "border-accent/20 bg-accent/10 text-accent",
        shadow: "hover:shadow-[0_0_24px_rgba(255,115,0,0.14)]",
      };
  }
}
