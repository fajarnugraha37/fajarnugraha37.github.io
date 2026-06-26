import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { AudioManifest, AudioManifestEntry, AudioContentKind } from "@/types";

export interface AudioBuildStateEntry {
  id: string;
  sourceHash: string;
  voice: string;
}

export interface AudioSourceDocument {
  id: string;
  kind: AudioContentKind;
  title: string;
  description: string;
  body: string;
  slug?: string;
  seriesSlug?: string;
  partSlug?: string;
}

export interface AudioBuildConfig {
  voice: string;
  baseUrl: string;
  speaker?: number;
  lengthScale?: number;
  noiseScale?: number;
  noiseWScale?: number;
}

export function createAudioSourceHash(
  document: AudioSourceDocument,
  config: AudioBuildConfig
) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        kind: document.kind,
        title: document.title,
        description: document.description,
        body: document.body,
        voice: config.voice,
        baseUrl: config.baseUrl,
        speaker: config.speaker ?? null,
        lengthScale: config.lengthScale ?? null,
        noiseScale: config.noiseScale ?? null,
        noiseWScale: config.noiseWScale ?? null,
      })
    )
    .digest("hex");
}

export async function readAudioBuildState(statePath: string) {
  try {
    const raw = await fs.readFile(statePath, "utf8");
    return JSON.parse(raw) as Record<string, AudioBuildStateEntry>;
  } catch {
    return {};
  }
}

export async function writeAudioBuildState(
  statePath: string,
  state: Record<string, AudioBuildStateEntry>
) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2));
}

export async function writeAudioManifest(
  manifestPath: string,
  entries: AudioManifestEntry[]
) {
  const manifest: AudioManifest = {
    generatedAt: new Date().toISOString(),
    entries,
  };

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}
