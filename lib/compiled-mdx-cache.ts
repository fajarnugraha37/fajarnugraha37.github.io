import fs from "fs/promises";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import {
  COMPILED_MDX_CACHE_VERSION,
  type CompiledMdxCacheEntry,
  getBlogCompiledMdxCachePath,
  getSeriesCompiledMdxCachePath,
} from "./content-index";
import { mdxSerializeOptions } from "./mdx-config";
import { getHeadings, normalizeMdxSource, getBlogData } from "./mdx";
import { getSeriesPart } from "./series";

async function readCompiledMdxCacheFile(filePath: string) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as CompiledMdxCacheEntry;
    if (parsed.version !== COMPILED_MDX_CACHE_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function buildCompiledMdxCacheEntry({
  title,
  content,
  fingerprint,
}: {
  title: string;
  content: string;
  fingerprint: string;
}): Promise<CompiledMdxCacheEntry> {
  const normalizedSource = normalizeMdxSource(content);
  const compiled = await serialize(normalizedSource, mdxSerializeOptions, true);

  return {
    version: COMPILED_MDX_CACHE_VERSION,
    fingerprint,
    compiledSource: compiled.compiledSource,
    scope: compiled.scope,
    frontmatter: compiled.frontmatter,
    headings: getHeadings(title, content),
  };
}

export async function getBlogCompiledMdx(slug: string) {
  const filePath = getBlogCompiledMdxCachePath(slug);
  const cached = await readCompiledMdxCacheFile(filePath);
  if (cached) {
    return cached;
  }

  const blog = await getBlogData(slug);
  return buildCompiledMdxCacheEntry({
    title: blog.title,
    content: blog.content,
    fingerprint: `runtime:${slug}`,
  });
}

export async function getSeriesPartCompiledMdx(seriesSlug: string, partSlug: string) {
  const filePath = getSeriesCompiledMdxCachePath(seriesSlug, partSlug);
  const cached = await readCompiledMdxCacheFile(filePath);
  if (cached) {
    return cached;
  }

  const part = getSeriesPart(seriesSlug, partSlug);
  if (!part) {
    return null;
  }

  return buildCompiledMdxCacheEntry({
    title: part.title,
    content: part.content,
    fingerprint: `runtime:${seriesSlug}:${partSlug}`,
  });
}

export async function ensureCompiledMdxCacheDirectory(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}
