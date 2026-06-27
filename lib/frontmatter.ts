import matter from "gray-matter";

function normalizeDescriptionLine(line: string) {
  const match = line.match(/^description:\s+(.*)$/);
  if (!match) {
    return line;
  }

  const value = match[1].trim();
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
  return `description: "${escaped}"`;
}

export function parseContentFrontmatter(fileContents: string) {
  const normalized = fileContents
    .replace(/\r\n/g, "\n")
    .replace(/^---\n([\s\S]*?)\n---/, (fullMatch, frontmatterBlock: string) => {
      const normalizedBlock = frontmatterBlock
        .split("\n")
        .map((line) => normalizeDescriptionLine(line))
        .join("\n");

      return `---\n${normalizedBlock}\n---`;
    });

  return matter(normalized);
}
