"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  descriptions: string[];
};

/**
 * Renders a list of career description bullet points.
 * Uses framer-motion for smooth height transition.
 */
export function ExpandableDescriptions({ descriptions }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (descriptions.length === 0) return null;
  if (descriptions.length === 1) {
    return (
      <p className="font-mono text-sm leading-relaxed text-foreground/78">
        {descriptions[0]}
      </p>
    );
  }

  return (
    <div>
      <div className="relative">
        <AnimatePresence mode="wait">
          {!expanded ? (
            <motion.p
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="line-clamp-2 font-mono text-sm leading-relaxed text-foreground/78"
            >
              {descriptions[0]}
            </motion.p>
          ) : (
            <motion.div
              key="expanded"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                {descriptions.map((desc, i) => (
                  <p
                    key={i}
                    className="mb-3 flex gap-2 font-mono text-sm leading-relaxed text-foreground/78"
                  >
                    <span className="text-accent shrink-0 mt-0.5">&gt;</span>
                    <span>{desc}</span>
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      <button
        type="button"
        id={`expand-desc-${descriptions[0].slice(0, 20).replace(/\s+/g, "-")}`}
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-accent"
        aria-expanded={expanded ? "true" : "false"}
      >
        <span
          className={`inline-block border border-border px-1 text-[9px] transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
        {expanded
          ? `Collapse ${descriptions.length} Details`
          : `Open ${descriptions.length} Details`}
      </button>
    </div>
  );
}
