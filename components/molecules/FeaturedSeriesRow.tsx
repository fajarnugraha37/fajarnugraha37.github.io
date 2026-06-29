"use client";

import { SeriesCatalogItem } from "@/types";
import { SeriesCard } from "@/components/molecules/SeriesCard";

interface FeaturedSeriesRowProps {
  items: SeriesCatalogItem[];
}

export function FeaturedSeriesRow({ items }: FeaturedSeriesRowProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent-secondary">
          Featured Tracks
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-accent-secondary/40 to-transparent" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible">
        {items.map((series, index) => (
          <div key={series.seriesSlug} className="min-w-[280px] md:min-w-0">
            <SeriesCard
              series={series}
              index={index}
              featuredLabel={series.featuredLabel}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
