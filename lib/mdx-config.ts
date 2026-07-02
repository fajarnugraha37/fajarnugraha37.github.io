import type { SerializeOptions } from "next-mdx-remote/serialize";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";

export const mdxSerializeOptions: SerializeOptions = {
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkEmoji, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeSlug, rehypeRaw],
  },
};
