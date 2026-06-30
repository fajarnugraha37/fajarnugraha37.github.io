"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { BlogSortOption } from "@/lib/data/blogs";

interface UseBlogUrlSyncProps {
  searchQuery: string;
  selectedTags: string[];
  page: number;
  sortBy: BlogSortOption;
}

/**
 * Headless Hook: useBlogUrlSync
 * Encapsulates the debounced synchronization of filter state to URL parameters.
 */
export function useBlogUrlSync({ searchQuery, selectedTags, page, sortBy }: UseBlogUrlSyncProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (query: string, tags: string[], p: number, sort: BlogSortOption) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (query) params.set("q", query);
      else params.delete("q");

      if (tags.length > 0) params.set("t", tags.join(","));
      else params.delete("t");

      if (p > 1) params.set("p", p.toString());
      else params.delete("p");

      if (sort !== "newest") params.set("sort", sort);
      else params.delete("sort");

      const search = params.toString();
      const queryStr = search ? `?${search}` : "";
      router.replace(`${pathname}${queryStr}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrl(searchQuery, selectedTags, page, sortBy);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags, page, sortBy, updateUrl]);
}
