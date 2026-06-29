"use client";

import { FeaturedSeriesRow } from "@/components/molecules/FeaturedSeriesRow";
import { SeriesCard } from "@/components/molecules/SeriesCard";
import { SeriesCatalogSection as SeriesCatalogSectionType } from "@/types";

interface SeriesCatalogSectionProps {
  section: SeriesCatalogSectionType;
}

export function SeriesCatalogSection({ section }: SeriesCatalogSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-28 space-y-6">
      <div className="space-y-2">
        {section.subtitle ? (
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
            {section.subtitle}
          </p>
        ) : null}

        <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground md:text-3xl">
          {section.title}
        </h2>

        {section.description ? (
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {section.description}
          </p>
        ) : null}
      </div>

      {section.featured.length > 0 ? <FeaturedSeriesRow items={section.featured} /> : null}

      {section.items.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {section.items.map((series, index) => (
            <SeriesCard
              key={series.seriesSlug}
              series={series}
              index={index}
              featuredLabel={series.featuredLabel}
              compact
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
