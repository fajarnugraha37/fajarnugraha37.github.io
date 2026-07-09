"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, X } from "lucide-react";
import { PageTransitionEffects } from "@/components/atoms/PageTransitionEffects";
import { TocNav } from "@/components/molecules/TocNav";
import { ContentAudioPlayer } from "@/components/molecules/ContentAudioPlayer";
import { AudioManifestEntry, SeriesPartSummary, TocHeading } from "@/types";
import { SeriesSidebar } from "@/components/molecules/SeriesSidebar";
import {
  SeriesMobileNavigator,
  type SeriesNavigatorGroup,
  type SeriesNavigatorPart,
} from "@/components/molecules/SeriesMobileNavigator";
import { SeriesPrevNextNav } from "@/components/molecules/SeriesPrevNextNav";
import { SeriesProgressTracker } from "@/components/molecules/SeriesProgressTracker";
import { getSeriesGroupForPart, groupSeriesParts } from "@/lib/series-navigation";
import { cn } from "@/lib/utils";

interface SeriesPartContentProps {
  part: SeriesPartSummary;
  headings: TocHeading[];
  parts: SeriesPartSummary[];
  previousPart: SeriesPartSummary | null;
  nextPart: SeriesPartSummary | null;
  audioEntry?: AudioManifestEntry | null;
  children: ReactNode;
}

export function SeriesPartContent({
  part,
  headings,
  parts,
  previousPart,
  nextPart,
  audioEntry,
  children,
}: SeriesPartContentProps) {
  const groups = groupSeriesParts(parts);
  const currentGroup = getSeriesGroupForPart(groups, part.slug);
  const showToc = headings.length > 2;
  const displayTitle = part.partTitle || part.title;
  const lessonHighlights = headings.slice(1, 4);
  const visibleTags = part.tags.slice(0, 4);
  const hiddenTagsCount = Math.max(part.tags.length - visibleTags.length, 0);
  const mobileGroups: SeriesNavigatorGroup[] = groups.map((group) => ({
    id: group.id,
    title: group.title,
    subtitle: group.subtitle,
    parts: group.parts.map((groupPart) => ({
      slug: groupPart.slug,
      title: groupPart.title,
      partTitle: groupPart.partTitle,
      order: groupPart.order,
    })),
  }));
  const previousMobilePart: SeriesNavigatorPart | null = previousPart
    ? {
        slug: previousPart.slug,
        title: previousPart.title,
        partTitle: previousPart.partTitle,
        order: previousPart.order,
      }
    : null;
  const nextMobilePart: SeriesNavigatorPart | null = nextPart
    ? {
        slug: nextPart.slug,
        title: nextPart.title,
        partTitle: nextPart.partTitle,
        order: nextPart.order,
      }
    : null;
  const readingModeStorageKey = `series-reading-mode:${part.seriesSlug}`;
  const readingProgressStorageKey = `series-reading-progress:${part.seriesSlug}:${part.slug}`;
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [resumeOffset, setResumeOffset] = useState<number | null>(null);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    try {
      const storedMode = window.localStorage.getItem(readingModeStorageKey);
      if (storedMode === "true") {
        setIsReadingMode(true);
      }

      const storedProgress = window.localStorage.getItem(readingProgressStorageKey);
      if (!storedProgress) return;

      const parsedProgress = Number(storedProgress);
      if (Number.isFinite(parsedProgress) && parsedProgress > 240) {
        setResumeOffset(parsedProgress);
      }
    } catch {
      // Ignore browser storage issues.
    }
  }, [readingModeStorageKey, readingProgressStorageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(readingModeStorageKey, isReadingMode ? "true" : "false");
    } catch {
      // Ignore browser storage issues.
    }
  }, [isReadingMode, readingModeStorageKey]);

  useEffect(() => {
    document.body.dataset.seriesReadingMode = isReadingMode ? "true" : "false";

    return () => {
      delete document.body.dataset.seriesReadingMode;
    };
  }, [isReadingMode]);

  useEffect(() => {
    const persistProgress = (scrollY: number) => {
      try {
        window.localStorage.setItem(readingProgressStorageKey, String(Math.max(0, Math.round(scrollY))));
      } catch {
        // Ignore browser storage issues.
      }
    };

    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const totalScrollable = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1,
        );
        const nextProgress = Math.min(Math.max(scrollY / totalScrollable, 0), 1);
        const delta = scrollY - lastScrollYRef.current;

        setScrollProgress(nextProgress);
        setChromeVisible(!isReadingMode || scrollY < 96 || delta <= 0);
        setResumeOffset((currentOffset) => {
          if (currentOffset === null) return currentOffset;
          return Math.abs(scrollY - currentOffset) < 120 || scrollY > currentOffset
            ? null
            : currentOffset;
        });
        lastScrollYRef.current = scrollY;

        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = window.setTimeout(() => {
          persistProgress(scrollY);
        }, 180);

        frameRef.current = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isReadingMode, readingProgressStorageKey]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isEditable || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "Escape" && isReadingMode) {
        event.preventDefault();
        setIsReadingMode(false);
        return;
      }

      if (event.altKey && event.shiftKey && event.key.toLowerCase() === "r") {
        event.preventDefault();
        setIsReadingMode((value) => !value);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isReadingMode]);

  const handleResumeReading = () => {
    if (resumeOffset === null) return;
    window.scrollTo({ top: resumeOffset, behavior: "smooth" });
    setResumeOffset(null);
  };

  return (
    <>
      <PageTransitionEffects />
      <SeriesProgressTracker seriesSlug={part.seriesSlug} partSlug={part.slug} />
      <div
        className={cn(
          "relative min-h-screen transition-colors duration-300",
          isReadingMode &&
            "bg-[radial-gradient(circle_at_top,rgba(101,210,255,0.08),transparent_26%)]",
        )}
      >
        <button
          data-reading-fab
          type="button"
          onClick={() => setIsReadingMode(false)}
          aria-hidden={!isReadingMode}
          className={cn(
            "fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 border border-accent/30 bg-background/90 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.16em] text-accent shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all md:bottom-6 md:right-6",
            isReadingMode
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0",
          )}
        >
          <X className="h-3.5 w-3.5" />
          Exit Reading
          <span className="border-l border-accent/30 pl-2 text-[9px] text-accent/70">
            Esc
          </span>
        </button>
        <article
          data-series-part-page
          data-series-slug={part.seriesSlug}
          data-part-slug={part.slug}
          data-reading-layout
          className={cn(
            "max-w-[1500px] mx-auto relative z-10 grid grid-cols-1 gap-6 px-4 pt-6 pb-28 transition-[max-width,padding] duration-300 md:pt-10 lg:gap-8 lg:pb-12 xl:gap-10",
            isReadingMode && "px-3 pt-4 md:px-5 md:pt-6",
            !isReadingMode &&
              (showToc
                ? "lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]"
                : "lg:grid-cols-[260px_minmax(0,1fr)]"),
          )}
        >
          {!isReadingMode && (
            <aside data-reading-sidebar className="hidden lg:block relative">
              <SeriesSidebar
                seriesSlug={part.seriesSlug}
                activePartSlug={part.slug}
                groups={groups}
                seriesTitle={part.seriesTitle}
                activeGroupId={currentGroup?.id}
              />
            </aside>
          )}

          <div
            data-reading-main
            className={cn("min-w-0", isReadingMode && "mx-auto w-full max-w-[78ch]")}
          >
            <div
              data-reading-chrome
              className={cn(
                "sticky top-16 z-30 -mx-4 mb-6 border-b border-accent/20 bg-background/90 px-4 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-transform duration-300 md:mb-8",
                isReadingMode && !chromeVisible && "-translate-y-[calc(100%+1rem)]",
              )}
            >
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-3",
                  isReadingMode && "gap-y-2",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                    <Link href="/series" className="hover:text-accent transition-colors">
                      Series
                    </Link>
                    <span>/</span>
                    <Link href={`/series/${part.seriesSlug}`} className="truncate hover:text-accent transition-colors">
                      {part.seriesTitle}
                    </Link>
                    {isReadingMode ? (
                      <>
                        <span>/</span>
                        <span className="truncate text-foreground/80">
                          {displayTitle}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {!isReadingMode ? (
                    <Link
                      href={`/series/${part.seriesSlug}`}
                      className="inline-flex items-center gap-1 border border-border/60 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      Series Map
                    </Link>
                  ) : null}
                  <button
                    data-reading-toggle
                    type="button"
                    onClick={() => setIsReadingMode((value) => !value)}
                    className={cn(
                      "inline-flex items-center gap-1 border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.15em] transition-colors",
                      isReadingMode
                        ? "border-accent bg-accent/10 text-accent hover:bg-accent hover:text-black"
                        : "border-border/60 text-muted-foreground hover:border-accent hover:text-accent",
                    )}
                  >
                    {isReadingMode ? "Exit Reading Mode" : "Enter Reading Mode"}
                  </button>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                    Lesson {part.order.toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-[2px] overflow-hidden bg-border/60">
                <div
                  data-reading-progress-bar
                  className="h-full bg-accent transition-[width] duration-150"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
              <div
                data-reading-hint
                className={cn(
                  "overflow-hidden text-[9px] font-mono uppercase tracking-[0.16em] text-muted-foreground transition-all duration-300",
                  isReadingMode
                    ? "mt-3 max-h-10 opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span>Focus mode active</span>
                  <span>/</span>
                  <span>Press Alt+Shift+R to toggle</span>
                  <span>/</span>
                  <span>Esc to exit</span>
                </div>
              </div>
            </div>

            {resumeOffset !== null ? (
              <div className="mb-4 border border-accent/20 bg-accent/5 p-3 md:mb-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
                      Resume Reading
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Continue this lesson from roughly where you stopped last time.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResumeReading}
                    className="inline-flex items-center justify-center border border-accent/30 bg-accent/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-black"
                  >
                    Resume From Last Position
                  </button>
                </div>
              </div>
            ) : null}

            <div className={cn("mb-6 space-y-4 md:mb-8", isReadingMode && "mb-8 md:mb-10")}>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
                {currentGroup ? (
                  <span className="border border-accent/20 bg-accent/5 px-2 py-1 text-accent">
                    {currentGroup.title}
                  </span>
                ) : null}
                <span className="text-muted-foreground">
                  Ordered learning track
                </span>
                {isReadingMode ? (
                  <span className="text-muted-foreground/80">
                    Quiet reading surface
                  </span>
                ) : null}
              </div>

              <h1
                id={headings[0]?.id}
                className={cn(
                  "text-3xl font-black leading-tight tracking-tighter text-foreground md:text-5xl",
                  isReadingMode && "md:text-[3.25rem]",
                )}
              >
                {displayTitle}
              </h1>

              {displayTitle !== part.title ? (
                <p className="text-sm font-mono text-muted-foreground md:text-base">
                  {part.title}
                </p>
              ) : null}

              <p
                className={cn(
                  "max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg",
                  isReadingMode &&
                    "max-w-[68ch] text-[1.02rem] leading-8 text-foreground/72 md:text-[1.1rem]",
                )}
              >
                {part.description}
              </p>

              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]",
                  isReadingMode && "text-[9px] text-muted-foreground/80",
                )}
              >
                <time className="border border-accent-secondary/20 bg-accent-secondary/5 px-2 py-1 text-accent-secondary">
                  [{part.date}]
                </time>
                <span className="text-muted-foreground">
                  {part.stats.readingTime} min read
                </span>
                <span className="text-muted-foreground">
                  {part.stats.wordCount} words
                </span>
              </div>

              {!isReadingMode && lessonHighlights.length > 0 ? (
                <div data-reading-highlights className="border border-border/50 bg-card/20 p-4 md:p-5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                    In This Lesson
                  </span>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {lessonHighlights.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className="border border-border/50 bg-background/40 px-3 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                      >
                        {heading.text}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {!isReadingMode ? (
              <div data-reading-mobile-nav>
                <SeriesMobileNavigator
                  seriesSlug={part.seriesSlug}
                  activePartSlug={part.slug}
                  groups={mobileGroups}
                  previousPart={previousMobilePart}
                  nextPart={nextMobilePart}
                  activeGroupId={currentGroup?.id}
                />
              </div>
            ) : null}

            {!isReadingMode ? (
              <div
                data-reading-lesson-meta
                className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]"
              >
                <span className="text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                  Lesson {part.order.toString().padStart(2, "0")}
                </span>
                <span className="text-muted-foreground">
                  {parts.length.toString().padStart(2, "0")} lesson track
                </span>
                {currentGroup ? (
                  <span className="text-accent">
                    {currentGroup.parts[0].order.toString().padStart(2, "0")}–{currentGroup.parts[currentGroup.parts.length - 1].order.toString().padStart(2, "0")} {currentGroup.title}
                  </span>
                ) : null}
              </div>
            ) : null}

            {audioEntry ? (
              <ContentAudioPlayer
                audio={audioEntry}
                label={isReadingMode ? "Listen while reading" : "Listen to this lesson"}
              />
            ) : null}

            {!isReadingMode ? (
              <div data-reading-tags className="mb-6 flex flex-wrap gap-2 md:mb-8">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] md:text-xs uppercase font-mono tracking-[0.15em] text-accent-tertiary bg-accent-tertiary/10 border border-accent-tertiary/30 px-3 py-1 cyber-chamfer-sm"
                  >
                    #{tag}
                  </span>
                ))}
                {hiddenTagsCount > 0 ? (
                  <span className="text-[10px] md:text-xs uppercase font-mono tracking-[0.15em] text-muted-foreground border border-border/60 px-3 py-1">
                    +{hiddenTagsCount} more
                  </span>
                ) : null}
              </div>
            ) : null}

            <div
              data-reading-article-shell
              className={cn(
                "markdown-body relative overflow-x-auto border bg-card/5 text-foreground/90 transition-all duration-300",
                isReadingMode
                  ? "mx-auto rounded-2xl border-accent/10 bg-background/60 px-4 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] md:px-8 md:py-10"
                  : "border-border/20 p-4 md:p-8",
              )}
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <div
                data-reading-prose
                className={cn(
                  "relative z-10 prose prose-invert max-w-none",
                  isReadingMode && "mx-auto max-w-[72ch] leading-8 md:leading-9",
                )}
              >
                {children}
              </div>
            </div>

            {!isReadingMode ? (
              <div data-reading-recap className="mt-6 border border-border/40 bg-card/10 p-4 md:p-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Lesson Recap
                </span>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  You just completed lesson {part.order.toString().padStart(2, "0")}
                  {currentGroup ? ` in ${currentGroup.title.toLowerCase()}` : ""}. Use the series map if you want to review the broader track, or continue directly into the next lesson while the context is still warm.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/series/${part.seriesSlug}`}
                    className="inline-flex items-center gap-2 border border-border/60 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back To Series
                  </Link>
                  {nextPart ? (
                    <Link
                      href={`/series/${part.seriesSlug}/${nextPart.slug}`}
                      className="inline-flex items-center gap-2 border border-accent/30 bg-accent/10 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-accent transition-colors hover:bg-accent hover:text-black"
                    >
                      Next Lesson
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}

            <SeriesPrevNextNav
              seriesSlug={part.seriesSlug}
              previousPart={previousPart}
              nextPart={nextPart}
            />
          </div>

          {!isReadingMode && showToc ? (
            <aside data-reading-toc className="hidden xl:block relative">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 font-mono text-xs">
                <h3 className="text-accent uppercase tracking-widest mb-6 border-b border-border pb-2">
                  [ ON_THIS_PAGE ]
                </h3>
                <TocNav headings={headings} />
              </div>
            </aside>
          ) : null}
        </article>
      </div>
    </>
  );
}
