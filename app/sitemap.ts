import { MetadataRoute } from "next";
import { getSortedBlogsData } from "@/lib/mdx";
import { getPublicSeries, getPublicSeriesPartEntries } from "@/lib/series";
import { ENV } from "@/lib/env";

export const dynamic = "force-static";

function parseStableDate(value: string | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

function getLatestStableDate(values: Array<string | undefined>) {
  const sorted = values
    .filter((value): value is string => Boolean(value) && /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort((left, right) => right.localeCompare(left));

  return parseStableDate(sorted[0]);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getSortedBlogsData();
  const series = getPublicSeries();
  const seriesParts = getPublicSeriesPartEntries();
  const baseUrl = ENV.BASE_URL;
  const siteLastModified = getLatestStableDate([
    ...blogs.map((blog) => blog.date),
    ...series.map((entry) => entry.lastUpdated),
    ...seriesParts.map((part) => part.date),
  ]);

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: parseStableDate(blog.date),
  }));

  const seriesOverviewUrls = series.map((entry) => ({
    url: `${baseUrl}/series/${entry.seriesSlug}`,
    lastModified: parseStableDate(entry.lastUpdated) || siteLastModified,
  }));

  const seriesPartUrls = seriesParts.map((part) => ({
    url: `${baseUrl}/series/${part.seriesSlug}/${part.partSlug}`,
    lastModified: parseStableDate(part.date) || siteLastModified,
  }));

  const labPaths = [
    "/labs",
    "/labs/postgresql",
    "/labs/duckdb",
    "/labs/knowledge-graph",
    "/labs/markdown",
  ];

  const labUrls = labPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: siteLastModified,
  }));

  return [
    {
      url: baseUrl,
      lastModified: siteLastModified,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: siteLastModified,
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: siteLastModified,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: siteLastModified,
    },
    {
      url: `${baseUrl}/series`,
      lastModified: siteLastModified,
    },
    ...labUrls,
    ...blogUrls,
    ...seriesOverviewUrls,
    ...seriesPartUrls,
  ];
}
