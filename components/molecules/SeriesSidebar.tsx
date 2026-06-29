"use client";

import Link from "next/link";
import { SeriesPartSummary } from "@/types";

interface SeriesSidebarProps {
  seriesSlug: string;
  activePartSlug: string;
  parts: SeriesPartSummary[];
  seriesTitle: string;
}

export function SeriesSidebar({
  seriesSlug,
  activePartSlug,
  parts,
  seriesTitle,
}: SeriesSidebarProps) {
  const activeIndex = parts.findIndex((part) => part.slug === activePartSlug);

  return (
    <div className="sticky top-24 font-mono text-xs">
      <h3 className="text-accent uppercase tracking-widest mb-2 border-b border-border pb-2">
        [ SERIES_MAP ]
      </h3>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-4">
        {seriesTitle}
      </p>
      <div className="mb-4 border border-border/50 bg-card/20 px-3 py-2">
        <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          <span>Progress</span>
          <span className="text-accent">
            {(activeIndex + 1).toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 h-1 bg-muted overflow-hidden">
          <div
            className="h-full bg-accent"
            style={{ width: `${((activeIndex + 1) / parts.length) * 100}%` }}
          />
        </div>
      </div>
      <nav className="space-y-2">
        {parts.map((part) => {
          const active = part.slug === activePartSlug;
          return (
            <Link
              key={part.slug}
              href={`/series/${seriesSlug}/${part.slug}`}
              className={`block border-l pl-3 py-2 transition-colors ${
                active
                  ? "border-accent text-accent bg-accent/5"
                  : "border-border/50 text-muted-foreground hover:text-accent hover:border-accent/60"
              }`}
            >
              <span className="block text-[9px] uppercase tracking-[0.15em] opacity-70">
                Part {part.order.toString().padStart(2, "0")}
              </span>
              <span className="block text-[11px] leading-snug mt-1">
                {part.partTitle || part.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
