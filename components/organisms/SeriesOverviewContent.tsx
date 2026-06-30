"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookMarked, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { ProgressBar } from "@/components/atoms/ProgressBar";
import { SeriesDetail } from "@/types";
import { cn } from "@/lib/utils";

interface SeriesOverviewContentProps {
  series: SeriesDetail;
}

export function SeriesOverviewContent({ series }: SeriesOverviewContentProps) {
  const estimatedHours = Math.max(1, Math.round((series.summary.totalReadingTime / 60) * 10) / 10);
  const progressStorageKey = `series-progress:${series.summary.seriesSlug}`;
  const [lastReadSlug, setLastReadSlug] = useState<string | null>(null);
  const [openPhaseIds, setOpenPhaseIds] = useState<string[]>(
    series.phases.slice(0, Math.min(2, series.phases.length)).map((phase) => phase.id),
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem(progressStorageKey);
      if (stored) {
        setLastReadSlug(stored);
      }
    } catch {
      setLastReadSlug(null);
    }
  }, [progressStorageKey]);

  const lastReadIndex = useMemo(
    () => series.parts.findIndex((part) => part.slug === lastReadSlug),
    [lastReadSlug, series.parts],
  );
  const lastReadPart = lastReadIndex >= 0 ? series.parts[lastReadIndex] : null;
  const continuePart =
    lastReadIndex >= 0 && lastReadIndex < series.parts.length - 1
      ? series.parts[lastReadIndex + 1]
      : lastReadPart;
  const activePhase = series.phases.find((phase) =>
    phase.parts.some((part) => part.slug === (continuePart?.slug || lastReadPart?.slug)),
  ) || null;
  const progressPercentage =
    lastReadPart && series.summary.totalParts > 0
      ? Math.round((lastReadPart.order / series.summary.totalParts) * 100)
      : 0;
  const visibleTags = series.summary.tags.slice(0, 5);
  const hiddenTagsCount = Math.max(series.summary.tags.length - visibleTags.length, 0);

  function togglePhase(phaseId: string) {
    setOpenPhaseIds((current) =>
      current.includes(phaseId)
        ? current.filter((id) => id !== phaseId)
        : [...current, phaseId],
    );
  }

  return (
    <PageTransition>
      <div className="py-8 md:py-12">
        <Link
          href="/series"
          className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-all group mb-8"
        >
          <div className="mr-3 p-1 border border-border group-hover:border-accent group-hover:bg-accent group-hover:text-black transition-all cyber-chamfer-sm">
            <ChevronLeft className="w-3 h-3" />
          </div>
          <span>ALL_SERIES</span>
        </Link>

        <PageHeader
          title={series.summary.seriesTitle}
          tagText="SERIES_OVERVIEW // CURRICULUM_MAP"
          tagIcon={BookMarked}
          subtitle={series.summary.description}
          className="mb-8 md:mb-10"
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-8">
            <div className="border border-border bg-card/20 p-5 md:p-6">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] mb-4">
                <span className="border border-accent/20 bg-accent/5 px-3 py-1 text-accent">
                  {series.summary.totalParts.toString().padStart(2, "0")} Lessons
                </span>
                <span className="border border-accent-secondary/20 bg-accent-secondary/5 px-3 py-1 text-accent-secondary">
                  {series.summary.totalReadingTime} Min Total
                </span>
                <span className="border border-accent-tertiary/20 bg-accent-tertiary/5 px-3 py-1 text-accent-tertiary">
                  {series.phases.length.toString().padStart(2, "0")} Phases
                </span>
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                This overview is designed to help you choose the right entry point quickly. Follow the full track from lesson one, continue from your last checkpoint, or jump straight into a phase that matches what you need right now.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="default" size="sm">
                  <Link href={`/series/${series.summary.seriesSlug}/${series.summary.firstPartSlug}`}>
                    Start From First Lesson
                  </Link>
                </Button>
                {lastReadPart ? (
                  <Button asChild variant="neutral" size="sm">
                    <Link href={`/series/${series.summary.seriesSlug}/${lastReadPart.slug}`}>
                      Continue Last Lesson
                    </Link>
                  </Button>
                ) : null}
                {series.phases[0] ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={`#phase-${series.phases[0].id}`}>
                      Open Curriculum Map
                    </a>
                  </Button>
                ) : null}
              </div>

              {visibleTags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {visibleTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase font-mono tracking-[0.15em] text-muted-foreground border border-border bg-card/30 px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                  {hiddenTagsCount > 0 ? (
                    <span className="text-[9px] uppercase font-mono tracking-[0.15em] text-muted-foreground/70 border border-border/60 px-2 py-1">
                      +{hiddenTagsCount} more
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 xl:hidden">
              {series.phases.map((phase, index) => (
                <a
                  key={phase.id}
                  href={`#phase-${phase.id}`}
                  className="shrink-0 border border-border/60 bg-card/20 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Phase {(index + 1).toString().padStart(2, "0")} · {phase.title}
                </a>
              ))}
            </div>
            <div className="mb-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground">
                Curriculum Map
              </h2>
              <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground mt-1">
                Navigate by phase, then choose the lesson that matches your current depth.
              </p>
            </div>

            {series.phases.map((phase, index) => {
              const isOpen = openPhaseIds.includes(phase.id);

              return (
                <section
                  key={phase.id}
                  id={`phase-${phase.id}`}
                  className="scroll-mt-28 border border-border bg-card/20"
                >
                  <button
                    type="button"
                    onClick={() => togglePhase(phase.id)}
                    className="flex w-full items-start justify-between gap-4 p-4 text-left md:p-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
                        <span className="border border-accent/20 bg-accent/5 px-2 py-1 text-accent">
                          Phase {(index + 1).toString().padStart(2, "0")}
                        </span>
                        <span className="text-muted-foreground">
                          Lessons {phase.fromOrder.toString().padStart(2, "0")}–{phase.toOrder.toString().padStart(2, "0")}
                        </span>
                        <span className="text-muted-foreground">
                          {phase.totalReadingTime} min
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-foreground md:text-2xl">
                        {phase.title}
                      </h3>

                      {phase.subtitle ? (
                        <p className="mt-2 text-sm font-mono uppercase tracking-[0.15em] text-muted-foreground">
                          {phase.subtitle}
                        </p>
                      ) : null}

                      {phase.description ? (
                        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                          {phase.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-1 shrink-0 border border-border/60 p-2 text-muted-foreground md:hidden">
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </div>
                  </button>

                  <div className={cn("border-t border-border/50", isOpen ? "block" : "hidden md:block")}>
                    <div className="divide-y divide-border/40">
                      {phase.parts.map((part) => (
                        <Link
                          key={part.slug}
                          href={`/series/${series.summary.seriesSlug}/${part.slug}`}
                          className="group grid grid-cols-[auto_minmax(0,1fr)_auto] gap-4 p-4 transition-colors hover:bg-accent/5 md:p-5"
                        >
                          <div className="border border-accent-secondary/20 bg-accent-secondary/5 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary h-fit">
                            {part.order.toString().padStart(2, "0")}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-bold leading-tight text-foreground transition-colors group-hover:text-accent md:text-lg">
                                {part.partTitle || part.title}
                              </h4>
                              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                                {part.stats.readingTime} min
                              </span>
                            </div>
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                              {part.description}
                            </p>
                          </div>

                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="xl:block">
            <div className="space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-accent/20 bg-accent/5 p-4">
                <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Total Parts
                </div>
                <div className="text-2xl font-black text-accent">
                  {series.summary.totalParts.toString().padStart(2, "0")}
                </div>
              </div>
              <div className="border border-accent-secondary/20 bg-accent-secondary/5 p-4">
                <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Reading Load
                </div>
                <div className="text-2xl font-black text-accent-secondary">
                  {series.summary.totalReadingTime}
                </div>
                <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mt-1">
                  Min Total
                </div>
              </div>
              <div className="border border-accent-tertiary/20 bg-accent-tertiary/5 p-4 col-span-2">
                <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  Estimated Commitment
                </div>
                <div className="text-xl font-black text-accent-tertiary">
                  {estimatedHours} Hour Learning Track
                </div>
                {series.summary.lastUpdated ? (
                  <div className="mt-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                    Last Updated {series.summary.lastUpdated}
                  </div>
                ) : null}
              </div>

              <div className="col-span-2 border border-border/50 bg-card/20 p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-secondary">
                  Progress Memory
                </span>
                {lastReadPart ? (
                  <>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Last opened lesson: <span className="text-foreground">{lastReadPart.partTitle || lastReadPart.title}</span>
                      {activePhase ? ` in ${activePhase.title}` : ""}.
                    </p>
                    <div className="mt-4">
                      <ProgressBar value={progressPercentage} label="Track Progress" color="bg-accent-secondary" />
                    </div>
                    {continuePart ? (
                      <Link
                        href={`/series/${series.summary.seriesSlug}/${continuePart.slug}`}
                        className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary hover:text-white transition-colors"
                      >
                        {lastReadIndex >= 0 && lastReadIndex < series.parts.length - 1 ? "Continue Next Lesson" : "Reopen Last Lesson"}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Open any lesson once and this overview will keep a lightweight local checkpoint on this device.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-border bg-card/20 p-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Jump Across Track
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Use this rail to move between phases instead of scanning the full page every time.
                </p>

                <nav className="mt-4 space-y-2">
                  {series.phases.map((phase, index) => (
                    <a
                      key={phase.id}
                      href={`#phase-${phase.id}`}
                      className="block border border-border/50 bg-card/10 px-3 py-3 transition-colors hover:border-accent hover:text-accent"
                    >
                      <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                        Phase {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-foreground">
                        {phase.title}
                      </span>
                      <span className="mt-1 block text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                        {phase.totalParts.toString().padStart(2, "0")} lessons · {phase.totalReadingTime} min
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

            </div>
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
