"use client";

import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { SeriesCatalogSection as SeriesCatalogSectionType } from "@/types";
import { PageTransition } from "@/components/atoms/PageTransition";
import { SeriesCategoryChips } from "@/components/molecules/SeriesCategoryChips";
import { SeriesCatalogSection } from "@/components/organisms/SeriesCatalogSection";

interface SeriesListSectionProps {
  catalog: SeriesCatalogSectionType[];
}

export function SeriesListSection({ catalog }: SeriesListSectionProps) {
  return (
    <PageTransition>
      <div id="series-catalog-top" className="py-8 md:py-12">
        <PageHeader
          title="LEARNING"
          accentText="SERIES"
          tagText="DATA_STREAM // STRUCTURED_LEARNING_PATHS"
          tagIcon={BookOpenText}
          subtitle="Ordered tracks for focused study and deliberate practice"
          className="mb-8"
        />

        <div className="space-y-8">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Browse by learning domain first, then pick the track that fits your current
            focus. Featured series surface the easiest entry points without forcing you to
            scan one long mixed list.
          </p>

          <SeriesCategoryChips sections={catalog} />
        </div>

        <div className="mt-10 space-y-14 md:mt-12 md:space-y-16">
          {catalog.map((section) => (
            <SeriesCatalogSection key={section.id} section={section} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
