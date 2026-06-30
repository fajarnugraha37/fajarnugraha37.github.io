"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { BlogCard } from "@/components/molecules/BlogCard";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { TagList } from "@/components/molecules/TagList";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBlogFilter } from "@/hooks/useBlogFilter";
import { usePagination } from "@/hooks/usePagination";
import { useBlogUrlSync } from "@/hooks/queries/useBlogUrlSync";
import {
  BLOG_SORT_OPTIONS,
  type BlogSortOption,
  getFeaturedBlogs,
  sortBlogs,
} from "@/lib/data/blogs";
import { BlogMetadata } from "@/types";

interface BlogListSectionProps {
  blogs: BlogMetadata[];
}

export function BlogListSection({ blogs }: BlogListSectionProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const initialTags = searchParams.get("t") ? searchParams.get("t")!.split(",") : [];
  const initialPage = searchParams.get("p") ? parseInt(searchParams.get("p")!, 10) : 1;
  const initialSort =
    (searchParams.get("sort") as BlogSortOption | null) && 
    BLOG_SORT_OPTIONS.some((option) => option.value === searchParams.get("sort"))
      ? (searchParams.get("sort") as BlogSortOption)
      : "newest";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [sortBy, setSortBy] = useState<BlogSortOption>(initialSort);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 5 : 8;
  const listTopRef = useRef<HTMLDivElement>(null);

  const { filteredBlogs, allTags } = useBlogFilter({
    blogs,
    searchQuery,
    selectedTags,
  });

  const sortedBlogs = useMemo(() => sortBlogs(filteredBlogs, sortBy), [filteredBlogs, sortBy]);
  const featuredBlogs = useMemo(() => getFeaturedBlogs(blogs, 3), [blogs]);

  const { safePage, totalPages, handlePageChange, startIndex, endIndex } = usePagination({
    totalRecords: sortedBlogs.length,
    pageSize,
    initialPage,
  });

  const pagedBlogs = sortedBlogs.slice(startIndex, endIndex);
  const hasActiveFilters =
    searchQuery.trim().length > 0 || selectedTags.length > 0 || sortBy !== "newest";
  const showFeatured = !hasActiveFilters && safePage === 1 && featuredBlogs.length > 0;

  useBlogUrlSync({ searchQuery, selectedTags, page: safePage, sortBy });

  function resetState() {
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("newest");
    handlePageChange(1);
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
    handlePageChange(1);
  }

  function clearTags() {
    setSelectedTags([]);
    handlePageChange(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    handlePageChange(1);
  }

  function handleSortChange(value: BlogSortOption) {
    setSortBy(value);
    handlePageChange(1);
  }

  function onPageChange(page: number) {
    handlePageChange(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-8" ref={listTopRef}>
      {/* <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="border border-border bg-card/20 p-5 cyber-chamfer md:p-6">
          <div className="space-y-4">
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Browse the archive by topic, query, or reading depth. If you are new here, start with
              the highlighted essays below, then narrow the stream once you know the domain you want.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="border border-accent-tertiary/20 bg-accent-tertiary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-tertiary">
                {blogs.length} archived entries
              </span>
              <span className="border border-border bg-card/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {allTags.length} topic tags
              </span>
              <span className="border border-border bg-card/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {featuredBlogs.length} curated entry points
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {featuredBlogs[0] ? (
                <Button asChild size="sm">
                  <Link href={`/blogs/${featuredBlogs[0].slug}`}>Open Highlighted Essay</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="sm">
                <Link href="#blog-archive-results">Jump To Archive</Link>
              </Button>
              <Button variant="neutral" size="sm" onClick={() => handleSortChange("longest")}>
                Open Long Reads
              </Button>
            </div>
          </div>
        </div>

        <div className="border border-border/70 bg-card/10 p-5 md:p-6">
          <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
            Reading Paths
          </span>
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                01 // Start Broad
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                Open a highlighted essay first if you want representative depth before filtering the archive.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                02 // Narrow By Topic
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                Use tags when you already know the lane: performance, distributed systems, SQL, or operations.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                03 // Match Your Time
              </span>
              <p className="text-sm leading-relaxed text-foreground/90">
                Sort by shortest for quick briefings, or longest when you want a deeper systems walkthrough.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {showFeatured && !isMobile ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent-tertiary">
                Featured Entry Points
              </span>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
                Strong places to start
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {featuredBlogs.map((blog, index) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                index={index}
                selectedTags={selectedTags}
                variant="featured"
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-8 md:flex-row md:items-start" id="blog-archive-results">
        <aside className="flex w-full shrink-0 flex-col gap-6 md:sticky md:top-24 md:w-72 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-accent group-focus-within:animate-pulse">
              &gt;
            </span>
            <input
              type="text"
              placeholder="SEARCH_LOGS..."
              aria-label="Search blog posts"
              className="w-full border border-border bg-input py-3 pl-8 pr-4 font-mono text-sm text-accent transition-all placeholder:opacity-30 focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,136,0.3)] focus:outline-none"
              value={searchQuery}
              onChange={(event) => handleSearch(event.target.value)}
            />
          </div>

          <div className="border border-border bg-card/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Sort Results
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Choose the reading order that fits your current session.
                </span>
              </div>
            </div>
            <select
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value as BlogSortOption)}
              className="mt-4 w-full border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
            >
              {BLOG_SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <TagList
            allTags={allTags}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            clearTags={clearTags}
            isMobile={isMobile}
            isExpanded={isTagsExpanded}
            toggleExpanded={() => setIsTagsExpanded(!isTagsExpanded)}
          />
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="border border-border/50 bg-card/10 px-4 py-4 cyber-chamfer-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  Archive View
                </span>
                <span className="block text-sm text-muted-foreground">
                  {sortedBlogs.length} entries matched · page {safePage} of {totalPages} · sorted by{" "}
                  {BLOG_SORT_OPTIONS.find((option) => option.value === sortBy)?.label.toLowerCase()}
                </span>
                {searchQuery.trim() ? (
                  <span className="inline-flex border border-accent/20 bg-accent/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
                    Query: {searchQuery.trim()}
                  </span>
                ) : null}
              </div>

              {hasActiveFilters ? (
                <Button variant="neutral" size="xs" onClick={resetState}>
                  Reset View
                </Button>
              ) : (
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  Browsing newest first
                </span>
              )}
            </div>

            {selectedTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="border border-accent bg-accent/15 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-accent transition-colors hover:bg-accent hover:text-black"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {sortedBlogs.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative flex flex-col items-center justify-center overflow-hidden border border-border/30 border-dashed bg-card/10 py-20 text-center cyber-chamfer"
                >
                  <div className="absolute inset-0 cyber-grid-bg opacity-5" />
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Search className="mb-4 h-12 w-12 text-destructive/40" />
                  </motion.div>
                  <span
                    className="mb-2 text-xl font-mono text-destructive cyber-glitch-text"
                    data-text="No Matching Logs"
                  >
                    No Matching Logs
                  </span>
                  <span className="max-w-sm text-sm font-mono text-muted-foreground">
                    Try a broader search, remove a tag, or reset the archive view to restore the full stream.
                  </span>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="neutral" size="sm" onClick={resetState}>
                      Reset View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSortChange("newest")}>
                      Newest First
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`${sortBy}-${safePage}-${selectedTags.join(",")}-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-6"
                >
                  <AnimatePresence>
                    {pagedBlogs.map((blog, idx) => (
                      <BlogCard
                        key={blog.slug}
                        blog={blog}
                        index={idx}
                        selectedTags={selectedTags}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PaginationControls currentPage={safePage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}
