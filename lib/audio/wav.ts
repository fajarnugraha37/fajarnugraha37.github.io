function readString(buffer: Buffer, start: number, length: number) {
  return buffer.toString("ascii", start, start + length);
}

function assertWaveHeader(buffer: Buffer) {
  if (readString(buffer, 0, 4) !== "RIFF" || readString(buffer, 8, 4) !== "WAVE") {
    throw new Error("Unsupported WAV file: invalid RIFF/WAVE header.");
  }
}

interface ParsedWaveData {
  sampleRate: number;
  numChannels: number;
  bitsPerSample: number;
  byteRate: number;
  blockAlign: number;
  audioFormat: number;
  data: Buffer;
}

function parseWave(buffer: Buffer): ParsedWaveData {
  assertWaveHeader(buffer);

  let offset = 12;
  let fmt: Omit<ParsedWaveData, "data"> | null = null;
  let data: Buffer | null = null;

  while (offset + 8 <= buffer.length) {
    const chunkId = readString(buffer, offset, 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;
    const chunkEnd = chunkStart + chunkSize;

    if (chunkId === "fmt ") {
      fmt = {
        audioFormat: buffer.readUInt16LE(chunkStart),
        numChannels: buffer.readUInt16LE(chunkStart + 2),
        sampleRate: buffer.readUInt32LE(chunkStart + 4),
        byteRate: buffer.readUInt32LE(chunkStart + 8),
        blockAlign: buffer.readUInt16LE(chunkStart + 12),
        bitsPerSample: buffer.readUInt16LE(chunkStart + 14),
      };
    } else if (chunkId === "data") {
      data = buffer.subarray(chunkStart, chunkEnd);
    }

    offset = chunkEnd + (chunkSize % 2);
  }

  if (!fmt || !data) {
    throw new Error("Unsupported WAV file: missing fmt or data chunk.");
  }

  if (fmt.audioFormat !== 1) {
    throw new Error("Unsupported WAV file: only PCM encoding is supported.");
  }

  return {
    ...fmt,
    data,
  };
}

function writeWaveHeader(dataLength: number, source: ParsedWaveData) {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + dataLength, 4);
  header.write("WAVE", 8, "ascii");
  header.write("fmt ", 12, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(source.audioFormat, 20);
  header.writeUInt16LE(source.numChannels, 22);
  header.writeUInt32LE(source.sampleRate, 24);
  header.writeUInt32LE(source.byteRate, 28);
  header.writeUInt16LE(source.blockAlign, 32);
  header.writeUInt16LE(source.bitsPerSample, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(dataLength, 40);
  return header;
}

export function concatWaveBuffers(buffers: Buffer[]) {
  if (buffers.length === 0) {
    throw new Error("Cannot concatenate empty WAV buffer list.");
  }

  const parsed = buffers.map(parseWave);
  const reference = parsed[0];

  for (const item of parsed.slice(1)) {
    if (
      item.sampleRate !== reference.sampleRate ||
      item.numChannels !== reference.numChannels ||
      item.bitsPerSample !== reference.bitsPerSample ||
      item.byteRate !== reference.byteRate ||
      item.blockAlign !== reference.blockAlign ||
      item.audioFormat !== reference.audioFormat
    ) {
      throw new Error("Cannot concatenate WAV files with different audio formats.");
    }
  }

  const dataLength = parsed.reduce((total, item) => total + item.data.length, 0);
  const header = writeWaveHeader(dataLength, reference);
  const pcmData = Buffer.concat(parsed.map((item) => item.data), dataLength);

  return {
    buffer: Buffer.concat([header, pcmData]),
    durationSeconds: reference.byteRate > 0 ? dataLength / reference.byteRate : 0,
  };
}
