"use client";

import { SeriesCatalogItem } from "@/types";
import { SeriesCard } from "@/components/molecules/SeriesCard";

interface FeaturedSeriesRowProps {
  items: SeriesCatalogItem[];
  title?: string;
  description?: string;
}

export function FeaturedSeriesRow({
  items,
  title = "Featured Tracks",
  description,
}: FeaturedSeriesRowProps) {
  return (
    <div className="space-y-4 border border-accent-secondary/20 bg-accent-secondary/5 p-4 md:p-5 cyber-chamfer">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent-secondary">
            {title}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-accent-secondary/40 to-transparent" />
        </div>
        {description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 xl:grid-cols-3 md:overflow-visible">
        {items.map((series, index) => (
          <div key={series.seriesSlug} className="min-w-[260px] md:min-w-0">
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
