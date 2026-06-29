"use client";

import React from "react";
import { Database } from "lucide-react";
import { Experience } from "@/types";
import { ExpandableDescriptions } from "@/components/molecules/ExpandableDescriptions";

interface CareerItemProps {
  job: Experience;
}

/**
 * Molecule: CareerItem
 * Renders a single job experience entry with timeline indicators.
 */
export function CareerItem({ job }: CareerItemProps) {
  const [headline, ...details] = job.descriptions;

  return (
    <div className="group relative border-l-2 border-border/30 pb-2 pl-8 md:pl-14">
      <div className="absolute left-[-11px] top-0 z-20">
        <div className="relative flex h-5 w-5 items-center justify-center overflow-hidden rotate-45 border-2 border-accent-secondary bg-background transition-all duration-500 group-hover:bg-accent-secondary group-hover:shadow-[0_0_15px_#ff00ff]">
          <div className="absolute inset-0 bg-accent-secondary/20 animate-pulse" />
        </div>
      </div>

      <div className="absolute left-[-2px] top-0 h-full w-0.5 bg-gradient-to-b from-accent-secondary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="border border-border/50 bg-muted/20 px-3 py-1 text-foreground">
                {job.year}
              </span>
              {/* <span className="text-accent-secondary">Active Role</span> */}
            </div>
            <h3 className="text-2xl font-black leading-none tracking-tighter text-foreground transition-all duration-300 group-hover:text-accent-secondary md:text-3xl">
              {job.role}
            </h3>
            <div className="mt-3 flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-accent-secondary">
              <span className="border border-accent-secondary/20 bg-accent-secondary/10 p-1">
                <Database className="w-3 h-3" />
              </span>
              {job.company}
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground md:justify-end">
            <span className="opacity-60">Timeline</span>
            <span className="h-px w-8 bg-border/60" />
            <span className="text-foreground">{job.year}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-border/40 bg-card/20 p-5 backdrop-blur-sm transition-all group-hover:border-accent-secondary/40">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent-secondary">
              Short Description
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90 md:text-[15px]">
              {headline}
            </p>
          </div>

          {details.length > 0 && (
            <div className="border border-border/30 bg-background/40 p-4">
              <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                Role Detail
              </p>
              <ExpandableDescriptions descriptions={details} />
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.tech.map((t) => (
            <span
              key={t}
              className="cursor-default border border-border/40 bg-background/50 px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-tight text-muted-foreground transition-all hover:border-accent-secondary/50 hover:text-accent-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
