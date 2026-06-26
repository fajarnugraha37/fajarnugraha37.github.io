const CALLOUT_PREFIXES = [
  "note",
  "tip",
  "important",
  "warning",
  "caution",
];

function stripMdxImports(input: string) {
  return input
    .replace(/^\s*import\s.+?;?\s*$/gm, "")
    .replace(/^\s*export\s.+?;?\s*$/gm, "");
}

function stripCodeBlocks(input: string) {
  return input.replace(/```[\s\S]*?```/g, "");
}

function stripJsxBlocks(input: string) {
  return input.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>/g, "");
}

function stripHtmlTags(input: string) {
  return input.replace(/<[^>]+>/g, " ");
}

function replaceLinks(input: string) {
  return input
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function replaceInlineCode(input: string) {
  return input.replace(/`([^`]+)`/g, "$1");
}

function replaceTables(input: string) {
  return input
    .replace(/^\|(.+)\|$/gm, (_, row: string) =>
      row
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
        .join(", ")
    )
    .replace(/^\|\s*[-:| ]+\|\s*$/gm, "");
}

function replaceBlockSyntax(input: string) {
  return input
    .replace(/^>+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*---+\s*$/gm, "")
    .replace(/^\s*___+\s*$/gm, "");
}

function normalizeWhitespace(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function stripCalloutLabels(input: string) {
  const pattern = new RegExp(
    `^(${CALLOUT_PREFIXES.join("|")})\\s*:?\\s*`,
    "gim"
  );

  return input.replace(pattern, "");
}

export function normalizeNarrationText(content: string) {
  return normalizeWhitespace(
    stripCalloutLabels(
      replaceBlockSyntax(
        replaceTables(
          replaceInlineCode(
            replaceLinks(
              stripHtmlTags(
                stripJsxBlocks(
                  stripCodeBlocks(
                    stripMdxImports(content)
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
