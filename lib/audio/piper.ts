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
  const response = await fetch(`${options.baseUrl}/synthesize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: options.text,
      voice: options.voice,
      speaker_id: options.speaker,
      length_scale: options.lengthScale,
      noise_scale: options.noiseScale,
      noise_w_scale: options.noiseWScale,
    }),
  });

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
