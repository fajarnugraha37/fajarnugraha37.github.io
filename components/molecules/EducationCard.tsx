"use client";

import React from "react";
import { Binary, Zap, Globe } from "lucide-react";
import { Education } from "@/types";

interface EducationCardProps {
  edu: Education;
}

/**
 * Molecule: EducationCard
 * Renders a standardized card for education or certification items.
 */
export function EducationCard({ edu }: EducationCardProps) {
  return (
    <div className="group relative overflow-hidden border border-border/60 bg-card/20 p-5 transition-all duration-300 hover:border-accent-tertiary/60">
      <div className="absolute right-4 top-4 opacity-[0.04] transition-opacity group-hover:opacity-[0.08]">
        <Binary className="h-16 w-16 text-accent-tertiary" />
      </div>

      <div className="relative z-10 grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:gap-6">
        <div className="w-fit border border-accent-tertiary/30 bg-accent-tertiary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-accent-tertiary">
          {edu.year}
        </div>

        <div>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-accent-tertiary md:text-xl">
                {edu.school}
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-accent-tertiary">
                <Zap className="h-3 w-3" />
                {edu.degree}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-b border-border/20 pb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <Globe className="h-3 w-3" />
            {edu.location}
          </div>

          <p className="mt-4 border-l-2 border-accent-tertiary/20 pl-4 text-sm leading-relaxed text-foreground/72">
            <span className="font-mono opacity-50">//</span> {edu.description}
          </p>
        </div>
      </div>
    </div>
  );
}
