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
            compact ? "p-3 md:p-3.5" : "p-5 md:p-6",
          )}
        >
          <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div
            className={cn(
              "absolute top-0 left-0 w-full bg-accent/10 transition-all group-hover:bg-accent group-hover:shadow-[0_0_10px_#00ff88]",
              compact ? "h-[2px]" : "h-1",
            )}
          />

          <div className={cn("relative z-10 flex flex-wrap items-center gap-2", compact ? "mb-2" : "mb-4")}>
            {featuredLabel ? (
              <span
                className={cn(
                  "font-mono uppercase tracking-[0.15em] text-accent bg-accent/5 border border-accent/20",
                  compact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[10px]",
                )}
              >
                {featuredLabel}
              </span>
            ) : null}
            {!compact ? (
              <>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                  {series.totalParts.toString().padStart(2, "0")} PARTS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/5 border border-accent-tertiary/20 px-2 py-1">
                  {series.totalReadingTime} MIN READ
                </span>
              </>
            ) : null}
          </div>

          <h2
            className={cn(
              "mb-3 font-bold leading-tight text-foreground transition-colors group-hover:text-accent",
              compact ? "mb-1 text-[15px] md:text-base" : "text-xl md:text-2xl",
            )}
          >
            {series.seriesTitle}
          </h2>

          <p
            className={cn(
              "font-mono text-sm leading-relaxed text-muted-foreground",
              compact ? "line-clamp-1 text-[11px] md:text-[12px]" : "line-clamp-3",
            )}
          >
            {series.description}
          </p>

          <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", compact ? "mt-1.5" : "mt-5")}>
            {compact ? (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary">
                {series.totalParts.toString().padStart(2, "0")} parts
              </span>
            ) : null}
            {compact ? (
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-tertiary">
                {series.totalReadingTime} min
              </span>
            ) : null}
            {series.tags.slice(0, compact ? 1 : 5).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "uppercase font-mono tracking-widest border text-muted-foreground border-border bg-card/30",
                  compact ? "px-1.5 py-0.5 text-[7px]" : "px-1.5 py-0.5 text-[9px]",
                )}
              >
                {tag}
              </span>
            ))}
            {compact && series.tags.length > 1 ? (
              <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-muted-foreground/70">
                +{series.tags.length - 1}
              </span>
            ) : null}
          </div>

          {!compact ? (
            <div className="mt-6 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-mono text-accent">START_SERIES</span>
              <div className="h-px flex-1 bg-accent/20" />
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              <span>View Track</span>
              <span className="text-accent transition-colors group-hover:text-accent-secondary">
                Open
              </span>
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
