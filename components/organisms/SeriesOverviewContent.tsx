"use client";

import Link from "next/link";
import { ArrowRight, BookMarked, ChevronLeft } from "lucide-react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { SeriesDetail } from "@/types";

interface SeriesOverviewContentProps {
  series: SeriesDetail;
}

export function SeriesOverviewContent({ series }: SeriesOverviewContentProps) {
  const estimatedHours = Math.max(1, Math.round((series.summary.totalReadingTime / 60) * 10) / 10);

  return (
    <PageTransition>
      <div className="py-8 md:py-12">
        <Link
          href="/series"
          className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group mb-8"
        >
          <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
            <ChevronLeft className="w-3 h-3" />
          </div>
          <span>ALL_SERIES</span>
        </Link>

        <PageHeader
          title={series.summary.seriesTitle}
          tagText="SERIES_OVERVIEW // CURRICULUM_MAP"
          tagIcon={BookMarked}
          subtitle={series.summary.description}
          className="mb-10"
        />

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] mb-10">
          <div className="border border-border bg-card/20 p-5 md:p-6">
            <p className="text-sm font-mono text-muted-foreground leading-relaxed">
              This track is ordered for sequential learning. Start from the first part if you want the full mental model, or jump directly into a chapter if you already know the foundations.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button asChild variant="default" size="sm">
                <Link href={`/series/${series.summary.seriesSlug}/${series.summary.firstPartSlug}`}>
                  START FROM PART 01
                </Link>
              </Button>
              <Button asChild variant="neutral" size="sm">
                <Link href={`/series/${series.summary.seriesSlug}/${series.parts[series.parts.length - 1].slug}`}>
                  JUMP TO LATEST PART
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border border-accent/20 bg-accent/5 p-4">
              <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Total Parts
              </div>
              <div className="text-2xl font-black text-accent">
                {series.summary.totalParts.toString().padStart(2, "0")}
              </div>
            </div>
            <div className="border border-accent-secondary/20 bg-accent-secondary/5 p-4">
              <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Reading Load
              </div>
              <div className="text-2xl font-black text-accent-secondary">
                {series.summary.totalReadingTime}
              </div>
              <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mt-1">
                MIN TOTAL
              </div>
            </div>
            <div className="border border-accent-tertiary/20 bg-accent-tertiary/5 p-4 col-span-2">
              <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Estimated Commitment
              </div>
              <div className="text-xl font-black text-accent-tertiary">
                {estimatedHours} HOUR LEARNING TRACK
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent bg-accent/5 border border-accent/20 px-3 py-1">
            {series.summary.totalParts.toString().padStart(2, "0")} PARTS
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-3 py-1">
            {series.summary.totalReadingTime} MIN TOTAL
          </span>
          {series.summary.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 border text-muted-foreground border-border bg-card/30"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              Curriculum Map
            </h2>
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mt-1">
              Ordered progression from foundations to advanced topics
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {series.parts.map((part) => (
            <Link
              key={part.slug}
              href={`/series/${series.summary.seriesSlug}/${part.slug}`}
              className="group block"
            >
              <article className="bg-card/20 border border-border p-4 md:p-5 hover:border-accent transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                        PART {part.order.toString().padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {part.stats.readingTime} MIN
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                      {part.partTitle || part.title}
                    </h2>
                    <p className="text-sm font-mono text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {part.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
