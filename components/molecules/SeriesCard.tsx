"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SeriesSummary } from "@/types";
import { cn } from "@/lib/utils";

interface SeriesCardProps {
  series: SeriesSummary;
  index: number;
  featuredLabel?: string;
  compact?: boolean;
}

export function SeriesCard({ series, index, featuredLabel, compact = false }: SeriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/series/${series.seriesSlug}`} className="group block h-full">
        <article
          className={cn(
            "relative h-full overflow-hidden border border-border bg-card/30 cyber-chamfer transition-all duration-300 hover:border-accent",
            compact ? "p-4 md:p-5" : "p-5 md:p-6",
          )}
        >
          <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/10 group-hover:bg-accent group-hover:shadow-[0_0_10px_#00ff88] transition-all" />

          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            {featuredLabel ? (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent bg-accent/5 border border-accent/20 px-2 py-1">
                {featuredLabel}
              </span>
            ) : null}
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
              {series.totalParts.toString().padStart(2, "0")} PARTS
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/5 border border-accent-tertiary/20 px-2 py-1">
              {series.totalReadingTime} MIN READ
            </span>
          </div>

          <h2
            className={cn(
              "mb-3 font-bold leading-tight text-foreground transition-colors group-hover:text-accent",
              compact ? "text-lg md:text-xl" : "text-xl md:text-2xl",
            )}
          >
            {series.seriesTitle}
          </h2>

          <p
            className={cn(
              "font-mono text-sm leading-relaxed text-muted-foreground",
              compact ? "line-clamp-2" : "line-clamp-3",
            )}
          >
            {series.description}
          </p>

          <div className={cn("flex flex-wrap gap-1.5", compact ? "mt-4" : "mt-5")}>
            {series.tags.slice(0, compact ? 3 : 5).map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 border text-muted-foreground border-border bg-card/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className={cn(
              "flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100",
              compact ? "mt-5" : "mt-6",
            )}
          >
            <span className="text-[10px] font-mono text-accent">START_SERIES</span>
            <div className="h-px flex-1 bg-accent/20" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
