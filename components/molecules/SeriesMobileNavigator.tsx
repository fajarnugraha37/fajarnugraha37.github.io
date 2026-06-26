"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SeriesPart } from "@/types";

interface SeriesMobileNavigatorProps {
  seriesSlug: string;
  activePartSlug: string;
  parts: SeriesPart[];
}

export function SeriesMobileNavigator({
  seriesSlug,
  activePartSlug,
  parts,
}: SeriesMobileNavigatorProps) {
  const [open, setOpen] = useState(false);
  const activePart = parts.find((part) => part.slug === activePartSlug);

  return (
    <div className="lg:hidden mb-6 border border-border bg-card/20">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-accent-secondary">
            PARTS_NAVIGATOR
          </span>
          <span className="block text-sm text-foreground mt-1 truncate">
            {activePart ? `Part ${activePart.order.toString().padStart(2, "0")} - ${activePart.partTitle || activePart.title}` : "Open curriculum"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <nav className="border-t border-border max-h-80 overflow-y-auto">
          {parts.map((part) => {
            const active = part.slug === activePartSlug;
            return (
              <Link
                key={part.slug}
                href={`/series/${seriesSlug}/${part.slug}`}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 border-l transition-colors ${
                  active
                    ? "border-accent bg-accent/5 text-accent"
                    : "border-transparent text-muted-foreground hover:text-accent hover:bg-card/40"
                }`}
              >
                <span className="block text-[9px] font-mono uppercase tracking-[0.15em] opacity-70">
                  Part {part.order.toString().padStart(2, "0")}
                </span>
                <span className="block text-sm mt-1 leading-snug">
                  {part.partTitle || part.title}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
