import fs from "fs/promises";
import path from "path";
import { chunkNarrationText } from "@/lib/audio/chunk";
import {
  AudioBuildConfig,
  createAudioSourceHash,
  readAudioBuildState,
  writeAudioBuildState,
  writeAudioManifest,
} from "@/lib/audio/manifest";
import { normalizeNarrationText } from "@/lib/audio/normalize";
import { synthesizeWithPiper } from "@/lib/audio/piper";
import { concatWaveBuffers } from "@/lib/audio/wav";
import { getAudioSourceDocuments } from "@/lib/audio/extract";
import { AudioManifestEntry } from "@/types";

const AUDIO_OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "audio");
const MANIFEST_PATH = path.join(process.cwd(), "public", "audio-manifest.json");
const STATE_PATH = path.join(process.cwd(), ".cache", "audio-build-state.json");

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      [
        `Missing required environment variable: ${name}`,
        "",
        "Audio generation requires a running Piper HTTP server.",
        "Set the required variables before running `bun run generate-audio`:",
        "- PIPER_BASE_URL, for example http://127.0.0.1:5000",
        "- PIPER_VOICE, for example en_US-lessac-medium",
        "",
        "PowerShell example:",
        '$env:PIPER_BASE_URL="http://127.0.0.1:5000"',
        '$env:PIPER_VOICE="en_US-lessac-medium"',
        "bun run generate-audio",
      ].join("\n")
    );
  }
  return value;
}

function getAudioConfig(): AudioBuildConfig {
  return {
    baseUrl: getRequiredEnv("PIPER_BASE_URL").replace(/\/+$/, ""),
    voice: getRequiredEnv("PIPER_VOICE"),
    speaker: process.env.PIPER_SPEAKER ? Number(process.env.PIPER_SPEAKER) : undefined,
    lengthScale: process.env.PIPER_LENGTH_SCALE ? Number(process.env.PIPER_LENGTH_SCALE) : undefined,
    noiseScale: process.env.PIPER_NOISE_SCALE ? Number(process.env.PIPER_NOISE_SCALE) : undefined,
    noiseWScale: process.env.PIPER_NOISE_W_SCALE ? Number(process.env.PIPER_NOISE_W_SCALE) : undefined,
  };
}

function getOutputPath(entry: { kind: "blog" | "series-part"; slug?: string; seriesSlug?: string; partSlug?: string; }) {
  if (entry.kind === "blog" && entry.slug) {
    return {
      filePath: path.join(AUDIO_OUTPUT_DIR, "blogs", `${entry.slug}.wav`),
      publicPath: `/assets/audio/blogs/${entry.slug}.wav`,
    };
  }

  if (entry.kind === "series-part" && entry.seriesSlug && entry.partSlug) {
    return {
      filePath: path.join(AUDIO_OUTPUT_DIR, "series", entry.seriesSlug, `${entry.partSlug}.wav`),
      publicPath: `/assets/audio/series/${entry.seriesSlug}/${entry.partSlug}.wav`,
    };
  }

  throw new Error(`Unsupported audio output target for ${JSON.stringify(entry)}`);
}

async function synthesizeDocument(
  entry: Parameters<typeof getOutputPath>[0] & {
    id: string;
    title: string;
    description: string;
    normalizedText: string;
    sourceHash: string;
  },
  config: AudioBuildConfig
) {
  const chunkDir = path.join(process.cwd(), ".cache", "audio-chunks", entry.id.replace(/[:/\\]+/g, "-"));
  await fs.rm(chunkDir, { recursive: true, force: true });
  await fs.mkdir(chunkDir, { recursive: true });

  const chunks = chunkNarrationText(entry.normalizedText);
  if (chunks.length === 0) {
    throw new Error(`No narration text generated for ${entry.id}`);
  }

  const chunkBuffers: Buffer[] = [];

  for (const chunk of chunks) {
    const chunkPath = path.join(chunkDir, `${String(chunk.index).padStart(4, "0")}.wav`);
    const buffer = await synthesizeWithPiper({
      baseUrl: config.baseUrl,
      voice: config.voice,
      text: chunk.text,
      outputPath: chunkPath,
      speaker: config.speaker,
      lengthScale: config.lengthScale,
      noiseScale: config.noiseScale,
      noiseWScale: config.noiseWScale,
    });
    chunkBuffers.push(buffer);
  }

  const { buffer, durationSeconds } = concatWaveBuffers(chunkBuffers);
  const output = getOutputPath(entry);
  await fs.mkdir(path.dirname(output.filePath), { recursive: true });
  await fs.writeFile(output.filePath, buffer);

  return {
    audioSrc: output.publicPath,
    durationSeconds,
  };
}

async function run() {
  console.log("Starting audio generation...");
  const config = getAudioConfig();
  console.log(`Using Piper server: ${config.baseUrl}`);
  console.log(`Using Piper voice: ${config.voice}`);
  const state = await readAudioBuildState(STATE_PATH);
  const sources = await getAudioSourceDocuments();
  const nextState: Record<string, { id: string; sourceHash: string; voice: string }> = {};
  const manifestEntries: AudioManifestEntry[] = [];

  for (const source of sources) {
    const normalizedText = normalizeNarrationText(source.body);
    if (!normalizedText) {
      console.log(`Skipping ${source.id}: empty narration after normalization.`);
      continue;
    }

    const sourceHash = createAudioSourceHash(
      {
        ...source,
        body: normalizedText,
      },
      config
    );

    const cached = state[source.id];
    const output = getOutputPath(source);
    const canReuse =
      cached?.sourceHash === sourceHash &&
      cached.voice === config.voice &&
      (await fs.stat(output.filePath).then(() => true).catch(() => false));

    let audioSrc = output.publicPath;
    let durationSeconds = 0;

    if (canReuse) {
      console.log(`Reusing audio for ${source.id}`);
      const buffer = await fs.readFile(output.filePath);
      durationSeconds = concatWaveBuffers([buffer]).durationSeconds;
    } else {
      console.log(`Generating audio for ${source.id}`);
      const generated = await synthesizeDocument(
        {
          ...source,
          normalizedText,
          sourceHash,
        },
        config
      );
      audioSrc = generated.audioSrc;
      durationSeconds = generated.durationSeconds;
    }

    manifestEntries.push({
      id: source.id,
      kind: source.kind,
      title: source.title,
      description: source.description,
      audioSrc,
      durationSeconds,
      voice: config.voice,
      sourceHash,
      generatedAt: new Date().toISOString(),
      textLength: normalizedText.length,
      wordCount: normalizedText.split(/\s+/).filter(Boolean).length,
      slug: source.slug,
      seriesSlug: source.seriesSlug,
      partSlug: source.partSlug,
    });

    nextState[source.id] = {
      id: source.id,
      sourceHash,
      voice: config.voice,
    };
  }

  await writeAudioBuildState(STATE_PATH, nextState);
  await writeAudioManifest(MANIFEST_PATH, manifestEntries);
  console.log("Audio generation complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
