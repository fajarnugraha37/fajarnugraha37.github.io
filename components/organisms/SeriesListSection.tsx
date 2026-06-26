"use client";

import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { SeriesSummary } from "@/types";
import { SeriesCard } from "@/components/molecules/SeriesCard";
import { PageTransition } from "@/components/atoms/PageTransition";

interface SeriesListSectionProps {
  seriesList: SeriesSummary[];
}

export function SeriesListSection({ seriesList }: SeriesListSectionProps) {
  return (
    <PageTransition>
      <div className="py-8 md:py-12">
        <PageHeader
          title="LEARNING"
          accentText="SERIES"
          tagText="DATA_STREAM // STRUCTURED_LEARNING_PATHS"
          tagIcon={BookOpenText}
          subtitle="Ordered tracks for focused study and deliberate practice"
          className="mb-12"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {seriesList.map((series, index) => (
            <SeriesCard key={series.seriesSlug} series={series} index={index} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
