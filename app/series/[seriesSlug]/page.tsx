import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesOverviewContent } from "@/components/organisms/SeriesOverviewContent";
import { getAllSeriesSlugs, getSeriesBySlug } from "@/lib/series";

export function generateStaticParams() {
  return getAllSeriesSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesSlug: string }>;
}): Promise<Metadata> {
  const { seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    return {
      title: "Series Not Found",
    };
  }

  return {
    title: `${series.summary.seriesTitle} | Series`,
    description: series.summary.description,
  };
}

export default async function SeriesOverviewPage({
  params,
}: {
  params: Promise<{ seriesSlug: string }>;
}) {
  const { seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    notFound();
  }

  return <SeriesOverviewContent series={series} />;
}
