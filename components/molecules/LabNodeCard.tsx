"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LabDefinition, getLabToneClasses } from "@/lib/data/labs";
import { cn } from "@/lib/utils";

interface LabNodeCardProps {
  node: LabDefinition;
  variant?: "default" | "compact";
}

/**
 * Molecule: LabNodeCard
 * Renders a stylized access point for a laboratory experimental node.
 */
export function LabNodeCard({ node, variant = "default" }: LabNodeCardProps) {
  const Icon = node.icon;
  const tone = getLabToneClasses(node.tone);
  const isCompact = variant === "compact";

  return (
    <Link
      href={node.path}
      className={cn(
        "group relative flex flex-col overflow-hidden border border-border bg-card/30 transition-all cyber-chamfer",
        tone.hoverBorder,
        tone.shadow,
        isCompact ? "p-5" : "p-6",
      )}
    >
      <div className={cn("flex items-start justify-between", isCompact ? "mb-3" : "mb-4")}>
        <div
          className={cn(
            "bg-muted/20 border border-border transition-colors",
            tone.hoverIconBorder,
            tone.text,
            isCompact ? "p-2.5" : "p-3",
          )}
        >
          <Icon className={isCompact ? "h-6 w-6" : "h-8 w-8"} />
        </div>
        <div className="flex flex-col items-end">
          <span className="mb-1 text-[8px] font-mono uppercase tracking-widest text-muted-foreground">
            NODE_STATUS
          </span>
          <span className={cn("text-[10px] font-mono font-bold animate-pulse", tone.text)}>
            [{node.status}]
          </span>
        </div>
      </div>

      <div className={cn("relative z-10", isCompact ? "space-y-2" : "space-y-3")}>
        <div className="space-y-1">
          <span className={cn("block text-[10px] font-mono uppercase tracking-[0.25em]", tone.text)}>
            {node.eyebrow}
          </span>
          <h2
            className={cn(
              "font-black tracking-tight text-foreground transition-colors",
              tone.hoverText,
              isCompact ? "text-lg leading-tight" : "text-2xl",
            )}
          >
            {node.name}
          </h2>
        </div>

        <p
          className={cn(
            "font-mono leading-relaxed text-muted-foreground",
            isCompact ? "line-clamp-2 text-[11px]" : "line-clamp-3 min-h-[3.75rem] text-xs",
          )}
        >
          {node.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {node.badges.slice(0, isCompact ? 2 : 3).map((badge) => (
            <span
              key={badge}
              className={cn(
                "border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.18em]",
                tone.chip,
              )}
            >
              {badge}
            </span>
          ))}
        </div>

        {isCompact ? null : (
          <div className="grid grid-cols-1 gap-2 border-t border-border/60 pt-3 text-[10px] font-mono uppercase tracking-[0.15em] md:grid-cols-2">
            <div className="space-y-1">
              <span className="block text-muted-foreground">Best For</span>
              <span className="block text-foreground">{node.bestFor}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-muted-foreground">Input</span>
              <span className="block text-foreground">{node.inputLabel}</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "mt-auto flex items-center gap-2 font-mono font-bold uppercase tracking-[0.2em] transition-colors",
          tone.hoverText,
          isCompact ? "pt-4 text-[10px]" : "pt-6 text-xs",
        )}
      >
        <span>{isCompact ? "Open Lab" : "Access Node"}</span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
