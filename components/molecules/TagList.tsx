"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tag, ChevronDown } from "lucide-react";

interface TagListProps {
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  isMobile: boolean;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

export function TagList({
  allTags,
  selectedTags,
  toggleTag,
  clearTags,
  isMobile,
  isExpanded,
  toggleExpanded,
}: TagListProps) {
  const shouldExpand = isMobile ? isExpanded : true;

  return (
    <div className="bg-card border border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
        <Tag className="w-8 h-8" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 md:mb-2 md:border-b md:border-border md:pt-4 md:pb-2">
          {isMobile ? (
            <button
              type="button"
              onClick={toggleExpanded}
              className="group/header flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <h3 className="flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-foreground transition-colors group-hover/header:text-accent">
                / TAGS
                {selectedTags.length > 0 && (
                  <span className="text-[10px] font-mono text-accent">
                    ({selectedTags.length})
                  </span>
                )}
              </h3>
            </button>
          ) : (
            <h3 className="flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-foreground">
              / TAGS
              {selectedTags.length > 0 && (
                <span className="text-[10px] font-mono text-accent">
                  ({selectedTags.length})
                </span>
              )}
            </h3>
          )}

          <div className="flex items-center gap-3">
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={clearTags}
                className="flex items-center gap-1 border border-destructive/30 px-2 py-0.5 text-[10px] font-mono text-destructive transition-colors hover:text-white bg-destructive/5"
              >
                CLEAR
              </button>
            )}
            {isMobile ? (
              <button
                type="button"
                onClick={toggleExpanded}
                aria-label={shouldExpand ? "Collapse tags" : "Expand tags"}
                className="text-accent"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    shouldExpand ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : null}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {shouldExpand && (
            <motion.div
              key="tags-content"
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden md:!h-auto md:!opacity-100"
            >
              <div className="px-4 pb-4 md:px-4 md:pb-4 flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs font-mono uppercase px-2 py-1 transition-all border ${
                        isSelected
                          ? "bg-accent text-black border-accent shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                          : "bg-transparent border-border text-muted-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
