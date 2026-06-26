"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SeriesSummary } from "@/types";

interface SeriesCardProps {
  series: SeriesSummary;
  index: number;
}

export function SeriesCard({ series, index }: SeriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/series/${series.seriesSlug}`} className="group block h-full">
        <article className="h-full bg-card/30 border border-border p-5 md:p-6 cyber-chamfer hover:border-accent transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-accent/10 group-hover:bg-accent group-hover:shadow-[0_0_10px_#00ff88] transition-all" />

          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
              {series.totalParts.toString().padStart(2, "0")} PARTS
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/5 border border-accent-tertiary/20 px-2 py-1">
              {series.totalReadingTime} MIN READ
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">
            {series.seriesTitle}
          </h2>

          <p className="text-sm font-mono text-muted-foreground leading-relaxed line-clamp-3">
            {series.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {series.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 border text-muted-foreground border-border bg-card/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-accent">START_SERIES</span>
            <div className="h-px flex-1 bg-accent/20" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
