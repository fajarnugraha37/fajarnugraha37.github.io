"use client";

import Link from "next/link";
import { ChevronLeft, LibraryBig } from "lucide-react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { TocNav } from "@/components/molecules/TocNav";
import { SeriesPart, TocHeading } from "@/types";
import { SeriesSidebar } from "@/components/molecules/SeriesSidebar";
import { SeriesMobileNavigator } from "@/components/molecules/SeriesMobileNavigator";
import { SeriesPrevNextNav } from "@/components/molecules/SeriesPrevNextNav";

interface SeriesPartContentProps {
  part: SeriesPart;
  headings: TocHeading[];
  parts: SeriesPart[];
  previousPart: SeriesPart | null;
  nextPart: SeriesPart | null;
  children: React.ReactNode;
}

export function SeriesPartContent({
  part,
  headings,
  parts,
  previousPart,
  nextPart,
  children,
}: SeriesPartContentProps) {
  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <article className="max-w-[1500px] mx-auto relative z-10 px-4 pt-8 md:pt-12 grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_220px] gap-8 xl:gap-10">
          <aside className="hidden xl:block relative">
            <SeriesSidebar
              seriesSlug={part.seriesSlug}
              activePartSlug={part.slug}
              parts={parts}
              seriesTitle={part.seriesTitle}
            />
          </aside>

          <div className="min-w-0">
            <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-accent/20 shadow-[0_15px_35px_rgba(0,0,0,0.9)] -mx-4 md:-mx-8 mb-8 px-4 md:px-8 py-4">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/series/${part.seriesSlug}`}
                  className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group"
                >
                  <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
                    <ChevronLeft className="w-3 h-3" />
                  </div>
                  <span>BACK_TO_SERIES</span>
                </Link>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                  PART {part.order.toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            <SeriesMobileNavigator
              seriesSlug={part.seriesSlug}
              activePartSlug={part.slug}
              parts={parts}
            />

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-accent mb-3">
              <LibraryBig className="w-3 h-3" />
              <span>{part.seriesTitle}</span>
            </div>

            <h1 id={headings[0]?.id} className="text-2xl md:text-4xl font-black text-foreground leading-tight tracking-tighter mb-4">
              {part.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <time className="text-accent-secondary font-mono text-[10px] bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-0.5">
                [{part.date}]
              </time>
              <span className="text-[10px] font-mono text-muted-foreground">
                {part.stats.readingTime} MIN READ
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {part.stats.wordCount} WORDS
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {part.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] md:text-xs uppercase font-mono tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 cyber-chamfer-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="markdown-body p-5 md:p-8 bg-card/5 border border-border/20 text-foreground/90 font-mono relative overflow-x-auto">
              <div className="relative z-10 prose prose-invert max-w-none">
                {children}
              </div>
            </div>

            <SeriesPrevNextNav
              seriesSlug={part.seriesSlug}
              previousPart={previousPart}
              nextPart={nextPart}
            />
          </div>

          <aside className="hidden xl:block relative">
            <div className="sticky top-24 font-mono text-xs">
              <h3 className="text-accent uppercase tracking-widest mb-6 border-b border-border pb-2">
                [ STRUCTURE ]
              </h3>
              <TocNav headings={headings} />
            </div>
          </aside>
        </article>
      </div>
    </PageTransition>
  );
}
