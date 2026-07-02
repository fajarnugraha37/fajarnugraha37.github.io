import {
  getBlogData,
  getAllBlogSlugs,
  getBlogMetadataBySlug,
  getBlogsBySlugs,
} from "@/lib/mdx";
import { BlogContent } from "@/components/organisms/BlogContent";
import { mdxComponents } from "@/components/molecules/MDXComponents";
import type { Metadata } from "next";
import relations from "@/public/relations.json";
import { getBlogAudioEntry } from "@/lib/audio/read";
import { getBlogCompiledMdx } from "@/lib/compiled-mdx-cache";
import { renderCompiledMdx } from "@/lib/compiled-mdx-render";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const postData = getBlogMetadataBySlug(resolvedParams.slug);

  if (!postData) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: `${postData.title} | Fajar Abdi Nugraha`,
    description: postData.description,
    authors: [{ name: "Fajar Abdi Nugraha" }],
    openGraph: {
      title: `${postData.title} | Fajar Abdi Nugraha`,
      description: postData.description,
      type: "article",
      publishedTime: postData.date,
      tags: postData.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${postData.title} | Fajar Abdi Nugraha`,
      description: postData.description,
    },
  };
}

/**
 * Blog Post Page
 * Server Component that fetches data and renders MDX content.
 */
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const postData = await getBlogData(resolvedParams.slug);
  const compiledMdx = await getBlogCompiledMdx(postData.slug);

  const relatedSlugs =
    (relations as Record<string, { slug: string }[]>)[postData.slug] || [];
  const relatedPosts = getBlogsBySlugs(relatedSlugs.map((entry) => entry.slug));
  const audioEntry = getBlogAudioEntry(postData.slug);

  return (
    <BlogContent 
      postData={postData} 
      headings={compiledMdx.headings} 
      relatedPosts={relatedPosts}
      audioEntry={audioEntry}
    >
      {renderCompiledMdx(compiledMdx, mdxComponents)}
    </BlogContent>
  );
}
