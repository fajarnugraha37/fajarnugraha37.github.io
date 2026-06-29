"use client";

import { SeriesCatalogSection } from "@/types";

interface SeriesCategoryChipsProps {
  sections: SeriesCatalogSection[];
}

export function SeriesCategoryChips({ sections }: SeriesCategoryChipsProps) {
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-16 z-20 -mx-4 border-y border-border bg-background/80 px-4 py-3 backdrop-blur md:top-20">
      <div className="flex min-w-max gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => scrollToSection("series-catalog-top")}
          className="shrink-0 border border-accent/30 bg-accent/5 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
        >
          All
        </button>

        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="shrink-0 border border-border bg-card/40 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {section.title}
          </button>
        ))}
      </div>
    </div>
  );
}
