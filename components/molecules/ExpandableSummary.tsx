"use client";

import { useState } from "react";
import { motion } from "motion/react";

/**
 * Wraps the Executive Summary block.
 * Uses framer-motion for smooth height transition instead of CSS variables.
 */
export function ExpandableSummary({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border/50 bg-card/25 p-5 backdrop-blur-sm md:p-6">
      <div className="relative overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
            transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
          }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      </div>

      <button
        type="button"
        id="summary-expand-btn"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-tertiary transition-colors hover:text-accent"
        aria-expanded={expanded ? "true" : "false"}
      >
        <span
          className={`flex h-4 w-4 items-center justify-center border border-accent-tertiary text-[8px] transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
        {expanded ? "Collapse Full Narrative" : "Open Full Narrative"}
        <span className="animate-blink">_</span>
      </button>
    </div>
  );
}
