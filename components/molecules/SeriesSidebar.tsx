"use client";

import Link from "next/link";
import { SeriesPart } from "@/types";

interface SeriesSidebarProps {
  seriesSlug: string;
  activePartSlug: string;
  parts: SeriesPart[];
  seriesTitle: string;
}

export function SeriesSidebar({
  seriesSlug,
  activePartSlug,
  parts,
  seriesTitle,
}: SeriesSidebarProps) {
  return (
    <div className="sticky top-24 font-mono text-xs">
      <h3 className="text-accent uppercase tracking-widest mb-2 border-b border-border pb-2">
        [ SERIES_MAP ]
      </h3>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-4">
        {seriesTitle}
      </p>
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
