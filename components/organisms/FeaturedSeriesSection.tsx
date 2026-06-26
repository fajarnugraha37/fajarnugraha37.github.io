"use client";

import Link from "next/link";
import { ChevronRight, LibraryBig } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { SeriesSummary } from "@/types";

interface FeaturedSeriesSectionProps {
  seriesList: SeriesSummary[];
}

export function FeaturedSeriesSection({
  seriesList,
}: FeaturedSeriesSectionProps) {
  return (
    <section className="py-16 md:py-24 border-t border-border relative overflow-hidden">
      <ScrollReveal direction="up">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground flex items-center gap-4">
            <span className="text-accent drop-shadow-[0_0_5px_#00ff88]">
              05 //
            </span>
            LEARNING SERIES
          </h2>
          <Link
            href="/series"
            className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
          >
            [VIEW_ALL_SERIES] <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seriesList.map((series, index) => (
          <ScrollReveal key={series.seriesSlug} delay={0.1 + index * 0.1} direction="up">
            <Link
              href={`/series/${series.seriesSlug}`}
              className="group block h-full"
            >
              <article className="h-full border border-border bg-card/30 p-5 md:p-6 cyber-chamfer hover:border-accent transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="flex items-start justify-between gap-4 relative z-10">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary mb-3">
                      <LibraryBig className="w-3 h-3" />
                      <span>{series.totalParts.toString().padStart(2, "0")} PARTS</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                      {series.seriesTitle}
                    </h3>
                    <p className="text-sm font-mono text-muted-foreground mt-3 leading-relaxed line-clamp-3">
                      {series.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/5 border border-accent-tertiary/20 px-2 py-1 shrink-0">
                    {series.totalReadingTime} MIN
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5 relative z-10">
                  {series.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 border text-muted-foreground border-border bg-card/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-accent">OPEN_CURRICULUM</span>
                  <div className="h-px flex-1 bg-accent/20" />
                </div>
              </article>
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-6 md:hidden flex justify-center">
        <Link
          href="/series"
          className="flex items-center gap-2 text-xs font-mono text-accent hover:text-white transition-colors"
        >
          [VIEW_ALL_SERIES] <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
