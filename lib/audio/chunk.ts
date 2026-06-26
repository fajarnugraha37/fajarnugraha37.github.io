export interface AudioTextChunk {
  index: number;
  text: string;
}

interface ChunkOptions {
  maxChars?: number;
  softMinChars?: number;
}

function splitParagraph(paragraph: string, maxChars: number) {
  const sentences = paragraph.match(/[^.!?]+[.!?]?/g) || [paragraph];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (sentence.length <= maxChars) {
      current = sentence.trim();
      continue;
    }

    const words = sentence.trim().split(/\s+/);
    let wordChunk = "";
    for (const word of words) {
      const wordCandidate = wordChunk ? `${wordChunk} ${word}` : word;
      if (wordCandidate.length <= maxChars) {
        wordChunk = wordCandidate;
      } else {
        if (wordChunk) {
          chunks.push(wordChunk);
        }
        wordChunk = word;
      }
    }

    current = wordChunk;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function chunkNarrationText(
  text: string,
  options: ChunkOptions = {}
): AudioTextChunk[] {
  const maxChars = options.maxChars ?? 1500;
  const softMinChars = options.softMinChars ?? 500;
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current.length >= softMinChars) {
      chunks.push(current);
      current = "";
    }

    if (paragraph.length <= maxChars) {
      current = paragraph;
      continue;
    }

    const paragraphChunks = splitParagraph(paragraph, maxChars);
    for (const paragraphChunk of paragraphChunks) {
      if (!current) {
        current = paragraphChunk;
        continue;
      }

      const merged = `${current}\n\n${paragraphChunk}`;
      if (merged.length <= maxChars) {
        current = merged;
      } else {
        chunks.push(current);
        current = paragraphChunk;
      }
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.map((chunk, index) => ({
    index,
    text: chunk,
  }));
}
