"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageTransition } from "@/components/atoms/PageTransition";
import { TocNav } from "@/components/molecules/TocNav";
import { ContentAudioPlayer } from "@/components/molecules/ContentAudioPlayer";
import { AudioManifestEntry, SeriesPart, SeriesPartSummary, TocHeading } from "@/types";
import { SeriesSidebar } from "@/components/molecules/SeriesSidebar";
import { SeriesMobileNavigator } from "@/components/molecules/SeriesMobileNavigator";
import { SeriesPrevNextNav } from "@/components/molecules/SeriesPrevNextNav";
import { getSeriesGroupForPart, groupSeriesParts } from "@/lib/series-navigation";

interface SeriesPartContentProps {
  part: SeriesPart;
  headings: TocHeading[];
  parts: SeriesPartSummary[];
  previousPart: SeriesPartSummary | null;
  nextPart: SeriesPartSummary | null;
  audioEntry?: AudioManifestEntry | null;
  children: React.ReactNode;
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
  const groups = useMemo(() => groupSeriesParts(parts), [parts]);
  const currentGroup = useMemo(() => getSeriesGroupForPart(groups, part.slug), [groups, part.slug]);
  const showToc = headings.length > 2;
  const displayTitle = part.partTitle || part.title;
  const lessonHighlights = headings.slice(1, 4);
  const visibleTags = part.tags.slice(0, 4);
  const hiddenTagsCount = Math.max(part.tags.length - visibleTags.length, 0);

  useEffect(() => {
    try {
      localStorage.setItem(`series-progress:${part.seriesSlug}`, part.slug);
    } catch {
      return;
    }
  }, [part.seriesSlug, part.slug]);

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <article className={`max-w-[1500px] mx-auto relative z-10 px-4 pt-6 pb-28 md:pt-10 lg:pb-12 grid grid-cols-1 ${showToc ? "lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_220px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"} gap-6 lg:gap-8 xl:gap-10`}>
          <aside className="hidden lg:block relative">
            <SeriesSidebar
              seriesSlug={part.seriesSlug}
              activePartSlug={part.slug}
              groups={groups}
              seriesTitle={part.seriesTitle}
              activeGroupId={currentGroup?.id}
            />
          </aside>

          <div className="min-w-0">
            <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-accent/20 bg-background/90 px-4 py-3 shadow-[0_10px_25px_rgba(0,0,0,0.45)] backdrop-blur-xl md:mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                    <Link href="/series" className="hover:text-accent transition-colors">
                      Series
                    </Link>
                    <span>/</span>
                    <Link href={`/series/${part.seriesSlug}`} className="truncate hover:text-accent transition-colors">
                      {part.seriesTitle}
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/series/${part.seriesSlug}`}
                    className="inline-flex items-center gap-1 border border-border/60 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Series Map
                  </Link>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent-secondary bg-accent-secondary/5 border border-accent-secondary/20 px-2 py-1">
                    Lesson {part.order.toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 space-y-4 md:mb-8">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
                {currentGroup ? (
                  <span className="border border-accent/20 bg-accent/5 px-2 py-1 text-accent">
                    {currentGroup.title}
                  </span>
                ) : null}
                <span className="text-muted-foreground">
                  Ordered learning track
                </span>
              </div>

              <h1 id={headings[0]?.id} className="text-3xl font-black leading-tight tracking-tighter text-foreground md:text-5xl">
                {displayTitle}
              </h1>

              {displayTitle !== part.title ? (
                <p className="text-sm font-mono text-muted-foreground md:text-base">
                  {part.title}
                </p>
              ) : null}

              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {part.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
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

              {lessonHighlights.length > 0 ? (
                <div className="border border-border/50 bg-card/20 p-4 md:p-5">
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

            <SeriesMobileNavigator
              seriesSlug={part.seriesSlug}
              activePartSlug={part.slug}
              groups={groups}
              previousPart={previousPart}
              nextPart={nextPart}
              activeGroupId={currentGroup?.id}
            />

            <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.15em]">
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

            {audioEntry ? (
              <ContentAudioPlayer
                audio={audioEntry}
                label="Listen to this lesson"
              />
            ) : null}

            <div className="mb-6 flex flex-wrap gap-2 md:mb-8">
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

            <div
              className="markdown-body relative overflow-x-auto border border-border/20 bg-card/5 p-4 text-foreground/90 md:p-8"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              <div className="relative z-10 prose prose-invert max-w-none">
                {children}
              </div>
            </div>

            <div className="mt-6 border border-border/40 bg-card/10 p-4 md:p-5">
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

            <SeriesPrevNextNav
              seriesSlug={part.seriesSlug}
              previousPart={previousPart}
              nextPart={nextPart}
            />
          </div>

          {showToc && (
            <aside className="hidden xl:block relative">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 font-mono text-xs">
                <h3 className="text-accent uppercase tracking-widest mb-6 border-b border-border pb-2">
                  [ ON_THIS_PAGE ]
                </h3>
                <TocNav headings={headings} />
              </div>
            </aside>
          )}
        </article>
      </div>
    </PageTransition>
  );
}
