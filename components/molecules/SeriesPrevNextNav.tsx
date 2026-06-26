"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SeriesPart } from "@/types";

interface SeriesPrevNextNavProps {
  seriesSlug: string;
  previousPart: SeriesPart | null;
  nextPart: SeriesPart | null;
}

export function SeriesPrevNextNav({
  seriesSlug,
  previousPart,
  nextPart,
}: SeriesPrevNextNavProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-10">
      {previousPart ? (
        <Link
          href={`/series/${seriesSlug}/${previousPart.slug}`}
          className="group border border-border bg-card/20 p-4 hover:border-accent transition-all"
        >
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Previous Part
          </div>
          <div className="text-foreground group-hover:text-accent transition-colors">
            {previousPart.partTitle || previousPart.title}
          </div>
        </Link>
      ) : (
        <div className="border border-border/40 bg-card/10 p-4 text-muted-foreground text-sm font-mono">
          START_OF_SERIES
        </div>
      )}

      {nextPart ? (
        <Link
          href={`/series/${seriesSlug}/${nextPart.slug}`}
          className="group border border-border bg-card/20 p-4 hover:border-accent transition-all text-right"
        >
          <div className="flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
            Next Part
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-foreground group-hover:text-accent transition-colors">
            {nextPart.partTitle || nextPart.title}
          </div>
        </Link>
      ) : (
        <div className="border border-border/40 bg-card/10 p-4 text-muted-foreground text-sm font-mono text-right">
          END_OF_SERIES
        </div>
      )}
    </div>
  );
}
