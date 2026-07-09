"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SeriesNavigatorPart {
  slug: string;
  title: string;
  partTitle?: string;
  order: number;
}

export interface SeriesNavigatorGroup {
  id: string;
  title: string;
  subtitle?: string;
  parts: SeriesNavigatorPart[];
}

interface SeriesMobileNavigatorProps {
  seriesSlug: string;
  activePartSlug: string;
  groups: SeriesNavigatorGroup[];
  previousPart: SeriesNavigatorPart | null;
  nextPart: SeriesNavigatorPart | null;
  activeGroupId?: string | null;
}

export function SeriesMobileNavigator({
  seriesSlug,
  activePartSlug,
  groups,
  previousPart,
  nextPart,
  activeGroupId,
}: SeriesMobileNavigatorProps) {
  const [open, setOpen] = useState(false);
  const parts = groups.flatMap((group) => group.parts);
  const activePart = parts.find((part) => part.slug === activePartSlug);
  const activeIndex = parts.findIndex((part) => part.slug === activePartSlug);
  const activeGroup = groups.find((group) => group.id === activeGroupId) || null;

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

  return (
    <>
      <div className="mb-6 border border-border bg-card/20 lg:hidden">
        <button
          data-series-mobile-open-inline
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
        >
          <div className="min-w-0">
            <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-accent-secondary">
              Curriculum
            </span>
            <span className="mt-1 block text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
              Lesson {(activeIndex + 1).toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
            </span>
            <span className="mt-1 block truncate text-sm text-foreground">
              {activePart ? activePart.partTitle || activePart.title : "Open the learning flow"}
            </span>
            {activeGroup ? (
              <span className="mt-2 inline-flex border border-accent/20 bg-accent/5 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.15em] text-accent">
                {activeGroup.title}
              </span>
            ) : null}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div
        data-series-mobile-overlay
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[70] transition-opacity duration-200 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
          <button
            data-series-mobile-close-overlay
            type="button"
            aria-label="Close curriculum"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <div
            data-series-mobile-sheet
            className={cn(
              "absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-3xl border border-border bg-background shadow-[0_-20px_60px_rgba(0,0,0,0.65)] transition-all duration-200",
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Learning Flow
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Jump between lessons without losing your place.
                </span>
              </div>
              <button
                data-series-mobile-close
                type="button"
                onClick={() => setOpen(false)}
                className="border border-border p-2 text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                <span>Progress</span>
                <span className="text-accent">
                  {(activeIndex + 1).toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="mt-2 h-1 bg-muted overflow-hidden">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${((activeIndex + 1) / parts.length) * 100}%` }}
                />
              </div>
            </div>

            <nav className="max-h-[60vh] overflow-y-auto px-4 pb-6">
              <div className="space-y-4">
                {groups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div
                      className={cn(
                        "border border-border/40 bg-card/10 px-3 py-2",
                        activeGroupId === group.id && "border-accent/40 bg-accent/5",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground">
                          {group.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                          {group.parts[0].order.toString().padStart(2, "0")}–{group.parts[group.parts.length - 1].order.toString().padStart(2, "0")}
                        </span>
                      </div>
                      {group.subtitle ? (
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                          {group.subtitle}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-1">
                      {group.parts.map((part) => {
                        const active = part.slug === activePartSlug;
                        return (
                          <Link
                            key={part.slug}
                            href={`/series/${seriesSlug}/${part.slug}`}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block border-l px-3 py-3 transition-colors",
                              active
                                ? "border-accent bg-accent/5 text-accent"
                                : "border-border/50 text-muted-foreground hover:text-accent hover:border-accent/60",
                            )}
                          >
                            <span className="block text-[9px] font-mono uppercase tracking-[0.15em] opacity-70">
                              Lesson {part.order.toString().padStart(2, "0")}
                            </span>
                            <span className="mt-1 block text-sm leading-snug">
                              {part.partTitle || part.title}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>

      <div className="fixed inset-x-4 bottom-4 z-[60] lg:hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border border-border bg-background/95 p-2 shadow-[0_20px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {previousPart ? (
            <Link
              href={`/series/${seriesSlug}/${previousPart.slug}`}
              className="flex min-w-0 items-center gap-2 border border-border/60 px-3 py-2 text-left text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span className="truncate text-[10px] font-mono uppercase tracking-[0.15em]">
                Prev
              </span>
            </Link>
          ) : (
            <div className="border border-border/40 px-3 py-2 text-center text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
              Start
            </div>
          )}

          <button
            data-series-mobile-open-floating
            type="button"
            onClick={() => setOpen(true)}
            className="border border-accent/30 bg-accent/10 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-black"
          >
            Curriculum
          </button>

          {nextPart ? (
            <Link
              href={`/series/${seriesSlug}/${nextPart.slug}`}
              className="flex min-w-0 items-center justify-end gap-2 border border-border/60 px-3 py-2 text-right text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span className="truncate text-[10px] font-mono uppercase tracking-[0.15em]">
                Next
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          ) : (
            <div className="border border-border/40 px-3 py-2 text-center text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60">
              Finish
            </div>
          )}
        </div>
      </div>
    </>
  );
}
