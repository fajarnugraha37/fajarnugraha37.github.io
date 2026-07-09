import fs from "fs/promises";
import path from "path";

const MAIN_TAG = "<main";
const MAIN_CLOSE_TAG = "</main>";
const BODY_CLOSE_TAG = "</body>";

interface StaticShellSnapshot {
  htmlAttrs: string;
  bodyAttrs: string;
  mainAttrs: string;
  headLinks: string;
  prefixHtml: string;
  suffixHtml: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function extractTagAttributes(source: string, tagName: string) {
  const match = source.match(new RegExp(`<${tagName}([^>]*)>`, "i"));
  return match?.[1] || "";
}

function extractHeadLinks(source: string) {
  const matches = source.match(/<link\b[^>]*>/gi) || [];
  const relevantLinks = matches.filter((tag) => {
    const normalized = tag.toLowerCase();
    return (
      normalized.includes('rel="stylesheet"') ||
      normalized.includes('rel="icon"') ||
      normalized.includes('rel="alternate"')
    );
  });

  return relevantLinks.join("");
}

function extractShellSnapshot(source: string): StaticShellSnapshot {
  const htmlAttrs = extractTagAttributes(source, "html");
  const bodyAttrs = extractTagAttributes(source, "body");
  const mainAttrs = extractTagAttributes(source, "main");
  const bodyOpenMatch = source.match(/<body[^>]*>/i);

  if (bodyOpenMatch?.index === undefined) {
    throw new Error("Failed to locate <body> in static shell reference.");
  }

  const bodyStart = bodyOpenMatch.index + bodyOpenMatch[0].length;
  const mainStart = source.indexOf(MAIN_TAG, bodyStart);
  const mainOpenEnd = source.indexOf(">", mainStart);
  const mainClose = source.indexOf(MAIN_CLOSE_TAG, mainOpenEnd);
  const bodyClose = source.lastIndexOf(BODY_CLOSE_TAG);
  const scriptAfterMain = source.indexOf("<script", mainClose);
  const suffixEnd =
    scriptAfterMain >= 0 && scriptAfterMain < bodyClose ? scriptAfterMain : bodyClose;

  if (mainStart < 0 || mainOpenEnd < 0 || mainClose < 0 || bodyClose < 0) {
    throw new Error("Failed to parse shell structure from static reference HTML.");
  }

  return {
    htmlAttrs,
    bodyAttrs,
    mainAttrs,
    headLinks: extractHeadLinks(source),
    prefixHtml: source.slice(bodyStart, mainStart),
    suffixHtml: source.slice(mainClose + MAIN_CLOSE_TAG.length, suffixEnd),
  };
}

async function loadShellReferenceHtml(outputRoot: string) {
  const candidates = [
    path.join(outputRoot, "about", "index.html"),
    path.join(outputRoot, "index.html"),
    path.join(outputRoot, "blogs", "index.html"),
  ];

  for (const candidate of candidates) {
    try {
      return await fs.readFile(candidate, "utf8");
    } catch {
      continue;
    }
  }

  throw new Error(`Unable to find static shell reference under ${outputRoot}`);
}

export async function renderStaticAppShellDocument({
  outputRoot,
  title,
  description,
  contentHtml,
  headHtml,
}: {
  outputRoot: string;
  title: string;
  description: string;
  contentHtml: string;
  headHtml?: string;
}) {
  const referenceHtml = await loadShellReferenceHtml(outputRoot);
  const snapshot = extractShellSnapshot(referenceHtml);

  return [
    "<!DOCTYPE html>",
    `<html${snapshot.htmlAttrs}>`,
    "<head>",
    '<meta charSet="utf-8"/>',
    '<meta name="viewport" content="width=device-width, initial-scale=1"/>',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}"/>`,
    snapshot.headLinks,
    headHtml || "",
    "</head>",
    `<body${snapshot.bodyAttrs}>`,
    snapshot.prefixHtml,
    `<main${snapshot.mainAttrs}>${contentHtml}</main>`,
    snapshot.suffixHtml,
    "</body>",
    "</html>",
  ].join("");
}
