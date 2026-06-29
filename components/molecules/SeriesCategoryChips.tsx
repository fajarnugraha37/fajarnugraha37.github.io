"use client";

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
  return (
    <div className="sticky top-16 z-20 -mx-4 border-y border-border bg-background/80 px-4 py-3 backdrop-blur md:top-20">
      <div className="flex min-w-max gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onSectionChange("all")}
          className={cn(
            "shrink-0 border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors",
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
              "shrink-0 border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors",
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
  );
}
