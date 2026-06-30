"use client";

import { useMemo, useState } from "react";
import { BookOpenText, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { FeaturedSeriesRow } from "@/components/molecules/FeaturedSeriesRow";
import { SeriesCard } from "@/components/molecules/SeriesCard";
import { SeriesCatalogItem, SeriesCatalogSection as SeriesCatalogSectionType } from "@/types";
import { PageTransition } from "@/components/atoms/PageTransition";
import { SeriesCategoryChips } from "@/components/molecules/SeriesCategoryChips";
import { Button } from "@/components/atoms/Button";

interface SeriesListSectionProps {
  catalog: SeriesCatalogSectionType[];
}

type SeriesCatalogListItem = SeriesCatalogItem & {
  sectionTitle: string;
  sectionSubtitle?: string;
  sectionOrder: number;
};

export function SeriesListSection({ catalog }: SeriesListSectionProps) {
  const [query, setQuery] = useState("");
  const [activeSectionId, setActiveSectionId] = useState("all");
  const [sortBy, setSortBy] = useState<"recommended" | "shortest" | "longest" | "title">("recommended");

  const allItems = useMemo(
    () =>
      catalog.flatMap((section) =>
        [...section.featured, ...section.items].map((item) => ({
          ...item,
          sectionTitle: section.title,
          sectionSubtitle: section.subtitle,
          sectionOrder: section.order,
        })),
      ),
    [catalog],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const queryMatchedItems = useMemo(() => {
    return allItems.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        item.seriesTitle,
        item.description,
        item.sectionTitle,
        item.featuredLabel || "",
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [allItems, normalizedQuery]);

  const countsBySection = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of queryMatchedItems) {
      counts[item.sectionId] = (counts[item.sectionId] ?? 0) + 1;
    }
    return counts;
  }, [queryMatchedItems]);

  const filteredItems = useMemo(() => {
    const sectionFiltered = queryMatchedItems.filter((item) =>
      activeSectionId === "all" ? true : item.sectionId === activeSectionId,
    );

    const sorted = [...sectionFiltered];
    sorted.sort((left, right) => {
      if (sortBy === "shortest") {
        if (left.totalReadingTime !== right.totalReadingTime) {
          return left.totalReadingTime - right.totalReadingTime;
        }
      } else if (sortBy === "longest") {
        if (left.totalReadingTime !== right.totalReadingTime) {
          return right.totalReadingTime - left.totalReadingTime;
        }
      } else if (sortBy === "title") {
        return left.seriesTitle.localeCompare(right.seriesTitle);
      } else {
        if (left.sectionOrder !== right.sectionOrder) {
          return left.sectionOrder - right.sectionOrder;
        }

        if (left.seriesOrder !== right.seriesOrder) {
          return left.seriesOrder - right.seriesOrder;
        }
      }

      return left.seriesTitle.localeCompare(right.seriesTitle);
    });

    return sorted;
  }, [activeSectionId, queryMatchedItems, sortBy]);

  const guidedPickItems = useMemo(
    () => filteredItems.filter((item) => item.featured).slice(0, 4),
    [filteredItems],
  );
  const showGuidedPicks = activeSectionId === "all" && normalizedQuery.length === 0 && guidedPickItems.length > 0;

  const selectedSection = useMemo(
    () => catalog.find((section) => section.id === activeSectionId) || null,
    [activeSectionId, catalog],
  );

  const groupedResults = useMemo(() => {
    const groups = new Map<string, { section: SeriesCatalogSectionType; items: SeriesCatalogListItem[] }>();

    for (const item of filteredItems) {
      const section = catalog.find((entry) => entry.id === item.sectionId);
      if (!section) {
        continue;
      }

      const existing = groups.get(section.id);
      if (existing) {
        existing.items.push(item);
      } else {
        groups.set(section.id, { section, items: [item] });
      }
    }

    const result = Array.from(groups.values());

    if (sortBy === "recommended") {
      return result.sort((left, right) => left.section.order - right.section.order);
    }

    return result.sort((left, right) => left.section.title.localeCompare(right.section.title));
  }, [catalog, filteredItems, sortBy]);

  const hasActiveFilters = activeSectionId !== "all" || normalizedQuery.length > 0 || sortBy !== "recommended";
  const resultsSummary =
    activeSectionId === "all"
      ? `${filteredItems.length} results across ${groupedResults.length} sections`
      : `${filteredItems.length} results in ${selectedSection?.title || "selected section"}`;

  function resetFilters() {
    setQuery("");
    setActiveSectionId("all");
    setSortBy("recommended");
  }

  return (
    <PageTransition>
      <div id="series-catalog-top" className="py-8 md:py-12">
        <PageHeader
          title="LEARNING"
          accentText="SERIES"
          tagText="DATA_STREAM // STRUCTURED_LEARNING_PATHS"
          tagIcon={BookOpenText}
          subtitle="Ordered tracks for focused study and deliberate practice"
          className="mb-8"
        />

        <div className="space-y-6">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Start with a quick search, pick a domain, then scan the tracks that best
            match your current learning goal. This page is designed to stay readable
            first on mobile, then scale up for deeper browsing on desktop.
          </p>

          <div className="space-y-4">
            <div className="border border-border bg-card/20 p-4 md:p-5">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                    <Search className="h-3 w-3" />
                    Search Series
                  </span>
                  <div className="flex items-center border border-border bg-card/40 focus-within:border-accent">
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search Java, Python, frontend, songwriting..."
                      className="w-full bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    />
                    {query ? (
                      <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="shrink-0 px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                    <SlidersHorizontal className="h-3 w-3" />
                    Sort Results
                  </span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                    className="w-full border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="shortest">Shortest First</option>
                    <option value="longest">Most Comprehensive</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </label>
              </div>

              <div className="mt-4">
                <SeriesCategoryChips
                  sections={catalog}
                  activeSectionId={activeSectionId}
                  onSectionChange={setActiveSectionId}
                  countsBySection={countsBySection}
                  allCount={queryMatchedItems.length}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border border-border/50 bg-card/10 px-4 py-3">
              <div className="min-w-0">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Active View
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {resultsSummary}
                  {normalizedQuery ? ` matching "${query.trim()}"` : ""}
                </span>
              </div>

              {hasActiveFilters ? (
                <Button variant="neutral" size="xs" onClick={resetFilters}>
                  Reset Filters
                </Button>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                  Recommended order
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8 md:mt-10">
          {showGuidedPicks ? (
            <FeaturedSeriesRow
              items={guidedPickItems}
              title="Start Here"
              description="Curated entry points for common goals. Use these picks when you want a strong starting track without scanning the whole catalog first."
            />
          ) : null}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_260px]">
            <section className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground md:text-3xl">
                    {selectedSection ? selectedSection.title : "All Series"}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {filteredItems.length} Results
                  </span>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {selectedSection?.description ||
                    "Browse the catalog by section, then open the track that best fits what you want to learn next."}
                </p>
              </div>

              {filteredItems.length === 0 ? (
                <div className="border border-border bg-card/20 p-6 cyber-chamfer">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                    No Matching Series
                  </span>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Nothing matches the current combination of search, section, and sort.
                    Try a broader keyword or reset the filters to reopen the full catalog.
                  </p>
                  <div className="mt-4">
                    <Button variant="neutral" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {groupedResults.map(({ section, items }) => (
                    <section
                      key={section.id}
                      id={`catalog-section-${section.id}`}
                      className="scroll-mt-28 space-y-4"
                    >
                      {activeSectionId === "all" ? (
                        <div className="border-b border-border/70 pb-4 md:pb-5">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                              Section
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-accent/30 to-transparent" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                              {items.length} tracks
                            </span>
                          </div>

                          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                            <div className="min-w-0">
                              <h3 className="text-xl font-black tracking-tight text-foreground md:text-2xl">
                                {section.title}
                              </h3>
                              {section.subtitle ? (
                                <p className="mt-1 text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                                  {section.subtitle}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          {section.description ? (
                            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                              {section.description}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="grid gap-3">
                        {items.map((series, index) => (
                          <SeriesCard
                            key={series.seriesSlug}
                            series={series}
                            index={index}
                            featuredLabel={series.featuredLabel || section.title}
                            compact
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </section>

            <aside className="hidden xl:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 space-y-4">
                <div className="border border-border bg-card/20 p-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                    Catalog Jump
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Jump straight to a section instead of scanning the full catalog top to bottom.
                  </p>

                  <nav className="mt-4 space-y-2">
                    {groupedResults.map(({ section, items }) => (
                      <a
                        key={section.id}
                        href={`#catalog-section-${section.id}`}
                        className="block border border-border/50 bg-card/10 px-3 py-3 transition-colors hover:border-accent hover:text-accent"
                      >
                        <span className="block text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                          {section.title}
                        </span>
                        <span className="mt-1 block text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
                          {items.length} tracks
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
