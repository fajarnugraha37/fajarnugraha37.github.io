import fs from "fs/promises";
import path from "path";

interface PiperSynthesisOptions {
  baseUrl: string;
  voice: string;
  text: string;
  outputPath: string;
  speaker?: number;
  lengthScale?: number;
  noiseScale?: number;
  noiseWScale?: number;
}

export async function synthesizeWithPiper(options: PiperSynthesisOptions) {
  const payload = JSON.stringify({
    text: options.text,
    voice: options.voice,
    speaker_id: options.speaker,
    length_scale: options.lengthScale,
    noise_scale: options.noiseScale,
    noise_w_scale: options.noiseWScale,
  });

  const endpointCandidates = [
    `${options.baseUrl}/`,
    `${options.baseUrl}/synthesize`,
  ];

  let response: Response;

  let lastError: unknown = null;

  for (const endpoint of endpointCandidates) {
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (response.status !== 404) {
        break;
      }
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  if (!response!) {
    const message = lastError instanceof Error ? lastError.message : String(lastError);
    throw new Error(
      [
        `Failed to reach Piper server at ${options.baseUrl}.`,
        "Make sure the HTTP server is running before `bun run generate-audio`.",
        "Recommended checks:",
        "- Put the model at `tools/piper/models/id_ID-news_tts-medium.onnx` or set `PIPER_MODEL_PATH`.",
        "- Run `bun run piper:doctor`.",
        "- Start the server with `bun run piper:start`.",
        "",
        `Original error: ${message}`,
      ].join("\n")
    );
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Piper synthesis failed (${response.status}): ${body}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.writeFile(options.outputPath, buffer);

  return buffer;
}
