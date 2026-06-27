import matter from "gray-matter";

const TEXT_FRONTMATTER_KEYS = new Set([
  "title",
  "description",
  "seriesTitle",
  "partTitle",
]);

function normalizeTextFrontmatterLine(line: string) {
  const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s+(.*)$/);
  if (!match) {
    return line;
  }

  const [, key, rawValue] = match;
  if (!TEXT_FRONTMATTER_KEYS.has(key)) {
    return line;
  }

  const value = rawValue.trim();
  if (
    value.length === 0 ||
    value.startsWith('"') ||
    value.startsWith("'") ||
    value.startsWith(">") ||
    value.startsWith("|")
  ) {
    return line;
  }

  if (!value.includes(":")) {
    return line;
  }

  const escaped = value.replace(/"/g, '\\"');
  return `${key}: "${escaped}"`;
}

export function parseContentFrontmatter(fileContents: string) {
  const normalized = fileContents
    .replace(/\r\n/g, "\n")
    .replace(/^---\n([\s\S]*?)\n---/, (fullMatch, frontmatterBlock: string) => {
      const normalizedBlock = frontmatterBlock
        .split("\n")
        .map((line) => normalizeTextFrontmatterLine(line))
        .join("\n");

      return `---\n${normalizedBlock}\n---`;
    });

  return matter(normalized);
}
