import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import { SeriesPartContent } from "@/components/organisms/SeriesPartContent";
import { getAllSeriesPartParams, getSeriesBySlug, getSeriesPart } from "@/lib/series";
import { getHeadings } from "@/lib/mdx";
import { getSeriesPartAudioEntry } from "@/lib/audio/read";

export function generateStaticParams() {
  return getAllSeriesPartParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesSlug: string; partSlug: string }>;
}): Promise<Metadata> {
  const { seriesSlug, partSlug } = await params;
  const part = getSeriesPart(seriesSlug, partSlug);

  if (!part) {
    return {
      title: "Series Part Not Found",
    };
  }

  return {
    title: `${part.title} | ${part.seriesTitle}`,
    description: part.description,
    openGraph: {
      title: `${part.title} | ${part.seriesTitle}`,
      description: part.description,
      type: "article",
      publishedTime: part.date,
      tags: part.tags,
    },
  };
}

export default async function SeriesPartPage({
  params,
}: {
  params: Promise<{ seriesSlug: string; partSlug: string }>;
}) {
  const { seriesSlug, partSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);
  const part = getSeriesPart(seriesSlug, partSlug);

  if (!series || !part) {
    notFound();
  }

  const headings = getHeadings(part.title, part.content);
  const currentIndex = series.parts.findIndex((entry) => entry.slug === part.slug);
  const previousPart = currentIndex > 0 ? series.parts[currentIndex - 1] : null;
  const nextPart =
    currentIndex >= 0 && currentIndex < series.parts.length - 1
      ? series.parts[currentIndex + 1]
      : null;
  const audioEntry = getSeriesPartAudioEntry(seriesSlug, partSlug);

  return (
    <SeriesPartContent
      part={part}
      headings={headings}
      parts={series.parts}
      previousPart={previousPart}
      nextPart={nextPart}
      audioEntry={audioEntry}
    >
      <MDXRemote
        source={part.content}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkMath, remarkEmoji, remarkGfm],
            rehypePlugins: [rehypeKatex, rehypeSlug, rehypeRaw],
          },
        }}
      />
    </SeriesPartContent>
  );
}
