import fs from "fs";
import path from "path";
import {
  SeriesDomainManifestData,
  SeriesManifestEntry,
  SeriesManifestPhase,
  SeriesManifestSection,
  SeriesSectionsData,
} from "@/types";

export const SERIES_ROOT_DIRECTORY = path.join(process.cwd(), "content", "series");
export const SERIES_SECTIONS_PATH = path.join(SERIES_ROOT_DIRECTORY, "sections.json");
export const LEGACY_SERIES_MANIFEST_PATH = path.join(SERIES_ROOT_DIRECTORY, "manifest.json");

export const SERIES_DOMAIN_IDS = [
  "lang",
  "ops",
  "ai",
  "music",
  "in-action",
  "build-from-scratch",
  "communication",
] as const;

export type SeriesDomainId = string;

export interface ResolvedSeriesSource extends SeriesManifestEntry {
  directory: string;
  directorySlug: string;
  domainId: SeriesDomainId;
  sourcePath: string;
}

export interface AggregatedSeriesManifest {
  sections: SeriesManifestSection[];
  series: ResolvedSeriesSource[];
}

function normalizeManifestPhases(value: unknown): SeriesManifestPhase[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const phases = value
    .map((phase) => {
      if (!phase || typeof phase !== "object") {
        return null;
      }

      const candidate = phase as Partial<SeriesManifestPhase>;
      if (
        typeof candidate.id !== "string" ||
        typeof candidate.title !== "string" ||
        typeof candidate.fromOrder !== "number" ||
        typeof candidate.toOrder !== "number"
      ) {
        return null;
      }

      return {
        id: candidate.id,
        title: candidate.title,
        subtitle: candidate.subtitle,
        description: candidate.description,
        fromOrder: candidate.fromOrder,
        toOrder: candidate.toOrder,
      } satisfies SeriesManifestPhase;
    })
    .filter((phase): phase is SeriesManifestPhase => phase !== null);

  return phases.length > 0 ? phases : undefined;
}

function normalizeSeriesEntry(
  domainId: SeriesDomainId,
  entry: SeriesManifestEntry,
): ResolvedSeriesSource | null {
  if (
    typeof entry.slug !== "string" ||
    typeof entry.directory !== "string" ||
    typeof entry.section !== "string" ||
    typeof entry.order !== "number"
  ) {
    return null;
  }

  const directorySlug = path.basename(entry.directory);
  const sourcePath = [domainId, entry.directory]
    .join("/")
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/");

  return {
    ...entry,
    domainId,
    directory: entry.directory,
    directorySlug,
    sourcePath,
    phases: normalizeManifestPhases((entry as { phases?: unknown }).phases),
  };
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function isSeriesDomainId(value: string): value is SeriesDomainId {
  return getSeriesDomainIds().includes(value);
}

export function inferSeriesDomainFromSlug(slug: string): SeriesDomainId | null {
  if (slug.startsWith("learn-lang-")) {
    return "lang";
  }

  if (slug.startsWith("learn-ops-")) {
    return "ops";
  }

  if (slug.startsWith("learn-ai-")) {
    return "ai";
  }

  if (slug.startsWith("learn-music-")) {
    return "music";
  }

  if (slug.startsWith("learn-in-action-")) {
    return "in-action";
  }

  if (slug.startsWith("learn-build-from-scratch-")) {
    return "build-from-scratch";
  }

  if (slug.startsWith("learn-ling-")) {
    return "communication";
  }

  return null;
}

export function loadSeriesSections(): SeriesSectionsData {
  const parsed = readJsonFile<Partial<SeriesSectionsData>>(SERIES_SECTIONS_PATH);
  return {
    sections: Array.isArray(parsed?.sections) ? parsed.sections : [],
  };
}

export function getSeriesDomainIds(): SeriesDomainId[] {
  if (!fs.existsSync(SERIES_ROOT_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(SERIES_ROOT_DIRECTORY, { withFileTypes: true })
    .filter((entry) => {
      if (!entry.isDirectory()) {
        return false;
      }

      return fs.existsSync(path.join(SERIES_ROOT_DIRECTORY, entry.name, "manifest.json"));
    })
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

export function getSeriesDomainManifestPaths() {
  return getSeriesDomainIds().map((domainId) =>
    path.join(SERIES_ROOT_DIRECTORY, domainId, "manifest.json"),
  );
}

export function loadSeriesDomainManifest(
  domainId: SeriesDomainId,
): { domainId: SeriesDomainId; manifestPath: string; data: SeriesDomainManifestData; entries: ResolvedSeriesSource[] } {
  const manifestPath = path.join(SERIES_ROOT_DIRECTORY, domainId, "manifest.json");
  const parsed = readJsonFile<Partial<SeriesDomainManifestData>>(manifestPath);
  const rawSeries = Array.isArray(parsed?.series) ? parsed.series : [];
  const entries = rawSeries
    .map((entry) => normalizeSeriesEntry(domainId, entry))
    .filter((entry): entry is ResolvedSeriesSource => entry !== null);

  return {
    domainId,
    manifestPath,
    data: { series: rawSeries },
    entries,
  };
}

export function loadAggregatedSeriesManifest(): AggregatedSeriesManifest {
  const sections = loadSeriesSections().sections;
  const series = getSeriesDomainIds().flatMap((domainId) => {
    const manifestPath = path.join(SERIES_ROOT_DIRECTORY, domainId, "manifest.json");
    if (!fs.existsSync(manifestPath)) {
      return [];
    }

    return loadSeriesDomainManifest(domainId).entries;
  });

  return { sections, series };
}

export function getSeriesContentDirectory(sourcePath: string) {
  return path.join(SERIES_ROOT_DIRECTORY, sourcePath);
}

export function getSeriesSourceMaps(manifest: AggregatedSeriesManifest) {
  const bySlug = new Map<string, ResolvedSeriesSource>();
  const byDirectorySlug = new Map<string, ResolvedSeriesSource>();
  const bySourcePath = new Map<string, ResolvedSeriesSource>();

  for (const entry of manifest.series) {
    bySlug.set(entry.slug, entry);
    byDirectorySlug.set(entry.directorySlug, entry);
    bySourcePath.set(entry.sourcePath, entry);
  }

  return { bySlug, byDirectorySlug, bySourcePath };
}
