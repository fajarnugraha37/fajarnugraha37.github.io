import fs from "fs";
import path from "path";
import { AudioManifest, AudioManifestEntry } from "@/types";

const AUDIO_MANIFEST_PATH = path.join(process.cwd(), "public", "audio-manifest.json");

function isAudioManifestEntry(value: unknown): value is AudioManifestEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    (entry.kind === "blog" || entry.kind === "series-part") &&
    typeof entry.title === "string" &&
    typeof entry.audioSrc === "string"
  );
}

export function readAudioManifest(): AudioManifest | null {
  try {
    const raw = fs.readFileSync(AUDIO_MANIFEST_PATH, "utf8");
    const manifest = JSON.parse(raw) as Partial<AudioManifest>;
    if (!manifest || !Array.isArray(manifest.entries)) {
      return null;
    }

    return {
      generatedAt:
        typeof manifest.generatedAt === "string"
          ? manifest.generatedAt
          : new Date(0).toISOString(),
      entries: manifest.entries.filter(isAudioManifestEntry),
    };
  } catch {
    return null;
  }
}

export function getBlogAudioEntry(slug: string) {
  const manifest = readAudioManifest();
  return manifest?.entries.find((entry) => entry.kind === "blog" && entry.slug === slug) || null;
}

export function getSeriesPartAudioEntry(seriesSlug: string, partSlug: string) {
  const manifest = readAudioManifest();
  return (
    manifest?.entries.find(
      (entry) =>
        entry.kind === "series-part" &&
        entry.seriesSlug === seriesSlug &&
        entry.partSlug === partSlug
    ) || null
  );
}
