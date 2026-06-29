"use client";

import { useMemo, useState } from "react";
import { BookOpenText } from "lucide-react";
import { PageHeader } from "@/components/molecules/PageHeader";
import { FeaturedSeriesRow } from "@/components/molecules/FeaturedSeriesRow";
import { SeriesCard } from "@/components/molecules/SeriesCard";
import { SeriesCatalogItem, SeriesCatalogSection as SeriesCatalogSectionType } from "@/types";
import { PageTransition } from "@/components/atoms/PageTransition";
import { SeriesCategoryChips } from "@/components/molecules/SeriesCategoryChips";

interface SeriesListSectionProps {
  catalog: SeriesCatalogSectionType[];
}

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

  const startHereItems = useMemo(
    () => filteredItems.filter((item) => item.featured).slice(0, 6),
    [filteredItems],
  );

  const selectedSection = useMemo(
    () => catalog.find((section) => section.id === activeSectionId) || null,
    [activeSectionId, catalog],
  );

  const groupedResults = useMemo(() => {
    const groups = new Map<string, { section: SeriesCatalogSectionType; items: (SeriesCatalogItem & { sectionTitle: string; sectionSubtitle?: string; sectionOrder: number; })[] }>();

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

        <div className="space-y-8">
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Find a learning track by topic, stack, or creative focus. Start with a quick
            search, narrow by domain, then pick a series that matches your current goal.
          </p>

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
              <label className="block">
                <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
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
                <span className="mb-2 block text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                  Sort Results
                </span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                  className="w-full border border-border bg-card/40 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                >
                  <option value="recommended">Recommended</option>
                  <option value="shortest">Shortest First</option>
                  <option value="longest">Most Comprehensive</option>
                  <option value="title">Title A-Z</option>
                </select>
              </label>
            </div>

            <SeriesCategoryChips
              sections={catalog}
              activeSectionId={activeSectionId}
              onSectionChange={setActiveSectionId}
              countsBySection={countsBySection}
              allCount={queryMatchedItems.length}
            />
          </div>
        </div>

        <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
          {startHereItems.length > 0 ? (
            <FeaturedSeriesRow items={startHereItems} title="Start Here" />
          ) : null}

          <section className="space-y-5">
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
                  "Scan the catalog quickly, then jump into the track that best matches what you want to learn next."}
              </p>
            </div>

            {filteredItems.length === 0 ? (
              <div className="border border-border bg-card/20 p-6 text-sm text-muted-foreground">
                No series match your current search. Try a broader keyword or switch to a
                different domain.
              </div>
            ) : (
              <div className="space-y-8">
                {groupedResults.map(({ section, items }) => (
                  <div key={section.id} className="space-y-4">
                    {activeSectionId === "all" ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                          {section.title}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
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
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
