import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import { SeriesPartContent } from "@/components/organisms/SeriesPartContent";
import {
  getAllSeriesPartParams,
  getSeriesBySlug,
  getSeriesPartSummaryBySlug,
} from "@/lib/series";
import { getSeriesPartAudioEntry } from "@/lib/audio/read";
import { getSeriesPartCompiledMdx } from "@/lib/compiled-mdx-cache";
import { renderCompiledMdx } from "@/lib/compiled-mdx-render";

export function generateStaticParams() {
  return getAllSeriesPartParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesSlug: string; partSlug: string }>;
}): Promise<Metadata> {
  const { seriesSlug, partSlug } = await params;
  const part = getSeriesPartSummaryBySlug(seriesSlug, partSlug);

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
  const part = getSeriesPartSummaryBySlug(seriesSlug, partSlug);
  const compiledMdx = await getSeriesPartCompiledMdx(seriesSlug, partSlug);

  if (!series || !part || !compiledMdx) {
    notFound();
  }

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
      headings={compiledMdx.headings}
      parts={series.parts}
      previousPart={previousPart}
      nextPart={nextPart}
      audioEntry={audioEntry}
    >
      {renderCompiledMdx(compiledMdx, mdxComponents)}
    </SeriesPartContent>
  );
}
