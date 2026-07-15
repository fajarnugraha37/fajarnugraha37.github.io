import fs from "fs";
import path from "path";
import { BlogMetadata, Blog, ContentStats, TocHeading } from "@/types";
import { parseContentFrontmatter } from "@/lib/frontmatter";
import { BLOG_INDEX_PATH, type BlogIndexData } from "@/lib/content-index";

const blogsDirectory = path.join(process.cwd(), "content", "blogs");
const blogIndexCache: { value: BlogIndexData | null | undefined } = { value: undefined };
const blogDataCache = new Map<string, Blog>();

function loadBlogIndex() {
  if (blogIndexCache.value !== undefined) {
    return blogIndexCache.value;
  }

  try {
    if (!fs.existsSync(BLOG_INDEX_PATH)) {
      blogIndexCache.value = null;
      return null;
    }

    const raw = fs.readFileSync(BLOG_INDEX_PATH, "utf8");
    blogIndexCache.value = JSON.parse(raw) as BlogIndexData;
    return blogIndexCache.value;
  } catch {
    blogIndexCache.value = null;
    return null;
  }
}

function stripBlogIndexEntry({ fileName: _fileName, fingerprint: _fingerprint, contentHash: _contentHash, ...entry }: BlogIndexData["items"][number]): BlogMetadata {
  return entry;
}

export function getSortedBlogsData(): BlogMetadata[] {
  const cachedIndex = loadBlogIndex();
  if (cachedIndex) {
    return cachedIndex.items.map(stripBlogIndexEntry);
  }

  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, "");
        const fullPath = path.join(blogsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = parseContentFrontmatter(fileContents);
        const stats = calculateContentStats(content);

        return {
          slug,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          description: data.description || "",
          stats,
        };
      });

  return allBlogsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllBlogSlugs() {
  const cachedIndex = loadBlogIndex();
  if (cachedIndex) {
    return cachedIndex.items.map((entry) => ({ slug: entry.slug }));
  }

  if (!fs.existsSync(blogsDirectory)) return [];
  return fs.readdirSync(blogsDirectory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export function getBlogsBySlugs(slugs: string[]) {
  if (slugs.length === 0) {
    return [];
  }

  const metadataBySlug = new Map(getSortedBlogsData().map((blog) => [blog.slug, blog]));
  return slugs
    .map((slug) => metadataBySlug.get(slug))
    .filter((blog): blog is BlogMetadata => Boolean(blog));
}

export function getBlogMetadataBySlug(slug: string): BlogMetadata | null {
  const cachedIndex = loadBlogIndex();
  if (cachedIndex) {
    const entry = cachedIndex.items.find((item) => item.slug === slug);
    return entry ? stripBlogIndexEntry(entry) : null;
  }

  return getSortedBlogsData().find((blog) => blog.slug === slug) || null;
}

export function calculateContentStats(rawContent: string): ContentStats {
  const cleanText = rawContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  const charCount = cleanText.length;
  const words = cleanText.trim().split(/\s+/);
  const wordCount = words.length === 1 && words[0] === "" ? 0 : words.length;
  const readingTime = Math.ceil(wordCount / 200);
  return { charCount, wordCount, readingTime };
}

function escapeAmbiguousComparatorText(segment: string) {
  return segment
    .replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, "[$1]($1)")
    .replace(/<->/g, "&lt;->")
    .replace(/<=/g, "&lt;=")
    .replace(/<(?=-)/g, "&lt;")
    .replace(/<(?=\s|\d)/g, "&lt;");
}

function isGenericTypeStart(text: string, index: number) {
  if (text[index] !== "<" || index <= 0 || index >= text.length - 1) {
    return false;
  }

  const previousChar = text[index - 1];
  const nextChar = text[index + 1];

  return /[A-Za-z0-9_$.?]/.test(previousChar) && /[A-Za-z?_]/.test(nextChar);
}

function escapeInlineGenericTypeSyntax(segment: string) {
  let result = "";

  for (let index = 0; index < segment.length; index += 1) {
    const char = segment[index];

    if (!isGenericTypeStart(segment, index)) {
      result += char;
      continue;
    }

    let depth = 1;
    result += "&lt;";

    for (index += 1; index < segment.length; index += 1) {
      const nestedChar = segment[index];

      if (nestedChar === "<" && isGenericTypeStart(segment, index)) {
        depth += 1;
        result += "&lt;";
        continue;
      }

      if (nestedChar === ">") {
        depth -= 1;
        result += "&gt;";

        if (depth === 0) {
          break;
        }

        continue;
      }

      result += nestedChar;
    }
  }

  return result;
}

function escapeInlineTagLikeSyntax(segment: string) {
  return segment.replace(/<\/?[A-Za-z][^>\n]*?>/g, (match) =>
    match.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );
}

function escapeInlineTemplateSyntax(segment: string) {
  return segment.replace(/{{[\s\S]*?}}/g, (match) =>
    match
      .replace(/{/g, "&#123;")
      .replace(/}/g, "&#125;")
  );
}

function escapeInlineHtmlCommentSyntax(segment: string) {
  return segment.replace(/<!--[\s\S]*?-->/g, (match) =>
    match.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  );
}

function isFenceDelimiter(line: string) {
  const trimmedLine = line.trimStart();
  return trimmedLine.match(/^([`~]{3,})(.*)$/);
}

function escapeCurlyBraceSyntax(segment: string) {
  return segment.replace(/{/g, "&#123;").replace(/}/g, "&#125;");
}

function escapeOnboardInlineOperatorCodeSyntax(segment: string) {
  return segment.replace(/`(<[^\w\s`>][^`\s>]*>)`/g, (_match, token: string) => {
    const escaped = token
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return `\`${escaped}\``;
  });
}

export function isOnboardSeriesSourcePath(sourcePath?: string | null) {
  return typeof sourcePath === "string" && (sourcePath === "onboard" || sourcePath.startsWith("onboard/"));
}

export function sanitizeImportedOnboardMdx(rawContent: string) {
  const lines = rawContent.split("\n");
  let activeFence: { marker: "`" | "~"; length: number } | null = null;

  return lines
    .map((line) => {
      const fenceMatch = isFenceDelimiter(line);
      if (!activeFence && fenceMatch) {
        activeFence = {
          marker: fenceMatch[1][0] as "`" | "~",
          length: fenceMatch[1].length,
        };
        return line;
      }

      if (activeFence) {
        const closingFencePattern =
          activeFence.marker === "`"
            ? new RegExp(`^\\s*\\\`{${activeFence.length},}\\s*$`)
            : new RegExp(`^\\s*~{${activeFence.length},}\\s*$`);

        if (closingFencePattern.test(line)) {
          activeFence = null;
        }

        return line;
      }

      const segments = line.split(/(`[^`]*`)/g);
      return segments
        .map((segment) =>
          escapeOnboardInlineOperatorCodeSyntax(
            escapeCurlyBraceSyntax(segment)
          )
        )
        .join("");
    })
    .join("\n");
}

export function prepareMdxSourceForCompile(rawContent: string, sourcePath?: string | null) {
  const source = isOnboardSeriesSourcePath(sourcePath)
    ? sanitizeImportedOnboardMdx(rawContent)
    : rawContent;

  return normalizeMdxSource(source);
}

export function normalizeMdxSource(rawContent: string) {
  const lines = rawContent.split("\n");
  let activeFence: { marker: "`" | "~"; length: number } | null = null;

  return lines
    .map((line) => {
      const trimmedLine = line.trimStart();

      if (!activeFence) {
        const openingFence = trimmedLine.match(/^([`~]{3,})([^`]*)$/);
        if (openingFence) {
          activeFence = {
            marker: openingFence[1][0] as "`" | "~",
            length: openingFence[1].length,
          };
          return line;
        }
      } else {
        const closingFencePattern =
          activeFence.marker === "`"
            ? new RegExp(`^\\\`{${activeFence.length},}\\s*$`)
            : new RegExp(`^~{${activeFence.length},}\\s*$`);

        if (closingFencePattern.test(trimmedLine)) {
          activeFence = null;
          return line;
        }

        return line;
      }

      const segments = line.split(/(`[^`]*`)/g);
      return segments
        .map((segment) =>
          segment.startsWith("`") && segment.endsWith("`")
            ? segment
            : escapeInlineHtmlCommentSyntax(
                escapeInlineTemplateSyntax(
                  escapeInlineTagLikeSyntax(
                    escapeInlineGenericTypeSyntax(
                      escapeAmbiguousComparatorText(segment)
                    )
                  )
                )
              )
        )
        .join("");
    })
    .join("\n");
}

/**
 * Utility: getHeadings
 * Extracts h1-h3 headings from MDX content for TOC generation.
 */
export function getHeadings(title: string, content: string): TocHeading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [
    {
      level: 1,
      text: title,
      id: title.toLowerCase().replace(/\s+/g, "-"),
      children: [],
    },
  ];

  const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "");
  let match;
  while ((match = headingRegex.exec(contentWithoutCode)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/\s+/g, "-");

    if (level === 2) {
      headings.push({ level, text, id, children: [] });
    } else if (level === 3 && headings.length > 0) {
      headings[headings.length - 1].children.push({ level, text, id, children: [] });
    }
  }
  return headings;
}

export async function getBlogData(slug: string): Promise<Blog> {
  const cachedBlog = blogDataCache.get(slug);
  if (cachedBlog) {
    return cachedBlog;
  }

  const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = parseContentFrontmatter(fileContents);
  const stats = calculateContentStats(content);

  const blog = {
    slug,
    content,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    description: data.description || "",
    stats,
  };

  blogDataCache.set(slug, blog);
  return blog;
}
