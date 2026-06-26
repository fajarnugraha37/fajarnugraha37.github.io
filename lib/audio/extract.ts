import { getBlogData, getSortedBlogsData } from "@/lib/mdx";
import { getAllSeries, getSeriesBySlug } from "@/lib/series";
import { AudioSourceDocument } from "@/lib/audio/manifest";

export async function getAudioSourceDocuments() {
  const documents: AudioSourceDocument[] = [];

  for (const blog of getSortedBlogsData()) {
    const detail = await getBlogData(blog.slug);
    documents.push({
      id: `blog:${detail.slug}`,
      kind: "blog",
      title: detail.title,
      description: detail.description,
      body: detail.content,
      slug: detail.slug,
    });
  }

  for (const series of getAllSeries()) {
    const detail = getSeriesBySlug(series.seriesSlug);
    if (!detail) {
      continue;
    }

    for (const part of detail.parts) {
      documents.push({
        id: `series-part:${series.seriesSlug}:${part.slug}`,
        kind: "series-part",
        title: part.partTitle || part.title,
        description: part.description,
        body: part.content,
        seriesSlug: series.seriesSlug,
        partSlug: part.slug,
      });
    }
  }

  return documents;
}
