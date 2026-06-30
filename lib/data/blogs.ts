import { BlogMetadata } from "@/types";

export type BlogSortOption = "newest" | "oldest" | "shortest" | "longest" | "title";

export const BLOG_SORT_OPTIONS: Array<{ value: BlogSortOption; label: string }> = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "shortest", label: "Shortest First" },
  { value: "longest", label: "Longest First" },
  { value: "title", label: "Title A-Z" },
];

export function getPrimaryBlogTag(blog: BlogMetadata) {
  return blog.tags[0] || "general";
}

export function getBlogReadingLabel(blog: BlogMetadata) {
  const readingTime = blog.stats?.readingTime ?? 0;

  if (readingTime >= 10) {
    return "LONG_READ";
  }

  if (readingTime >= 6) {
    return "FIELD_GUIDE";
  }

  return "BRIEFING";
}

export function getBlogFormatLabel(blog: BlogMetadata) {
  const readingTime = blog.stats?.readingTime ?? 0;

  if (readingTime >= 12) {
    return "DEEP_DIVE";
  }

  if (readingTime >= 7) {
    return "SYSTEM_NOTE";
  }

  return "QUICK_LOG";
}

export function sortBlogs(blogs: BlogMetadata[], sortBy: BlogSortOption) {
  const items = [...blogs];

  switch (sortBy) {
    case "oldest":
      return items.sort((left, right) => left.date.localeCompare(right.date));
    case "shortest":
      return items.sort(
        (left, right) => (left.stats?.readingTime ?? 0) - (right.stats?.readingTime ?? 0),
      );
    case "longest":
      return items.sort(
        (left, right) => (right.stats?.readingTime ?? 0) - (left.stats?.readingTime ?? 0),
      );
    case "title":
      return items.sort((left, right) => left.title.localeCompare(right.title));
    case "newest":
    default:
      return items.sort((left, right) => right.date.localeCompare(left.date));
  }
}

export function getFeaturedBlogs(blogs: BlogMetadata[], limit = 3) {
  const ranked = [...blogs].sort((left, right) => {
    const readingDelta = (right.stats?.readingTime ?? 0) - (left.stats?.readingTime ?? 0);
    if (readingDelta !== 0) {
      return readingDelta;
    }

    return right.date.localeCompare(left.date);
  });

  const featured: BlogMetadata[] = [];
  const seenPrimaryTags = new Set<string>();

  for (const blog of ranked) {
    const primaryTag = getPrimaryBlogTag(blog);
    if (seenPrimaryTags.has(primaryTag)) {
      continue;
    }

    featured.push(blog);
    seenPrimaryTags.add(primaryTag);

    if (featured.length === limit) {
      return featured;
    }
  }

  for (const blog of ranked) {
    if (featured.some((entry) => entry.slug === blog.slug)) {
      continue;
    }

    featured.push(blog);

    if (featured.length === limit) {
      break;
    }
  }

  return featured;
}
