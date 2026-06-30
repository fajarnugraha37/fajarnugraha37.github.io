"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, X } from "lucide-react";
import { SeriesCatalogSection } from "@/types";
import { cn } from "@/lib/utils";

interface SeriesCategoryChipsProps {
  sections: SeriesCatalogSection[];
  activeSectionId: string;
  onSectionChange: (sectionId: string) => void;
  countsBySection: Record<string, number>;
  allCount: number;
}

export function SeriesCategoryChips({
  sections,
  activeSectionId,
  onSectionChange,
  countsBySection,
  allCount,
}: SeriesCategoryChipsProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const activeLabel = useMemo(() => {
    if (activeSectionId === "all") {
      return `All (${allCount})`;
    }

    const section = sections.find((entry) => entry.id === activeSectionId);
    if (!section) {
      return `All (${allCount})`;
    }

    return `${section.title} (${countsBySection[section.id] ?? 0})`;
  }, [activeSectionId, allCount, countsBySection, sections]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  function selectSection(sectionId: string) {
    onSectionChange(sectionId);
    setOpen(false);
  }

  return (
    <>
      <div className="sticky top-16 z-20 -mx-4 border-y border-border bg-background/80 px-4 py-3 backdrop-blur md:top-20">
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-between gap-3 border border-border bg-card/40 px-4 py-3 text-left transition-colors hover:border-accent hover:text-accent"
          >
            <div className="min-w-0">
              <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-accent">
                Browse Categories
              </span>
              <span className="mt-1 block truncate text-sm text-foreground">
                {activeLabel}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <div className="hidden flex-wrap gap-2 pb-1 md:flex">
          <button
            type="button"
            onClick={() => onSectionChange("all")}
            className={cn(
              "shrink-0 whitespace-nowrap border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors",
              activeSectionId === "all"
                ? "border-accent/30 bg-accent/5 text-accent"
                : "border-border bg-card/40 text-muted-foreground hover:border-accent hover:text-accent",
            )}
          >
            All ({allCount})
          </button>

          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "shrink-0 whitespace-nowrap border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors",
                activeSectionId === section.id
                  ? "border-accent/30 bg-accent/5 text-accent"
                  : "border-border bg-card/40 text-muted-foreground hover:border-accent hover:text-accent",
              )}
            >
              {section.title} ({countsBySection[section.id] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[160] md:hidden">
              <button
                type="button"
                aria-label="Close categories"
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-background/85 backdrop-blur-sm"
              />
              <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-3xl border border-border bg-background shadow-[0_-20px_60px_rgba(0,0,0,0.65)]">
                <div className="flex items-center justify-between border-b border-border px-4 py-4">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                      Browse Categories
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Pick a domain first, then scan the matching tracks.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-4 py-4">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => selectSection("all")}
                      className={cn(
                        "flex w-full items-center justify-between gap-4 border px-4 py-3 text-left transition-colors",
                        activeSectionId === "all"
                          ? "border-accent/30 bg-accent/5 text-accent"
                          : "border-border bg-card/40 text-muted-foreground hover:border-accent hover:text-accent",
                      )}
                    >
                      <span className="text-sm font-semibold">All</span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em]">
                        {allCount} results
                      </span>
                    </button>

                    {sections.map((section) => (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => selectSection(section.id)}
                        className={cn(
                          "flex w-full items-start justify-between gap-4 border px-4 py-3 text-left transition-colors",
                          activeSectionId === section.id
                            ? "border-accent/30 bg-accent/5 text-accent"
                            : "border-border bg-card/40 text-muted-foreground hover:border-accent hover:text-accent",
                        )}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-foreground">
                            {section.title}
                          </span>
                          {section.subtitle ? (
                            <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                              {section.subtitle}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.15em]">
                          {countsBySection[section.id] ?? 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
