import { MetadataRoute } from "next";
import { getSortedBlogsData } from "@/lib/mdx";
import { getAllSeries, getSeriesBySlug } from "@/lib/series";
import { ENV } from "@/lib/env";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getSortedBlogsData();
  const series = getAllSeries();
  const baseUrl = ENV.BASE_URL;

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
  }));

  const seriesOverviewUrls = series.map((entry) => ({
    url: `${baseUrl}/series/${entry.seriesSlug}`,
    lastModified: new Date(),
  }));

  const seriesPartUrls = series.flatMap((entry) => {
    const detail = getSeriesBySlug(entry.seriesSlug);
    if (!detail) {
      return [];
    }

    return detail.parts.map((part) => ({
      url: `${baseUrl}/series/${entry.seriesSlug}/${part.slug}`,
      lastModified: part.date ? new Date(part.date) : new Date(),
    }));
  });

  const labPaths = [
    "/labs",
    "/labs/postgresql",
    "/labs/duckdb",
    "/labs/knowledge-graph",
    "/labs/markdown",
  ];

  const labUrls = labPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/series`,
      lastModified: new Date(),
    },
    ...labUrls,
    ...blogUrls,
    ...seriesOverviewUrls,
    ...seriesPartUrls,
  ];
}
