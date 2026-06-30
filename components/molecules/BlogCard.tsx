"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { BlogMetadata } from "@/types";
import { getBlogFormatLabel, getBlogReadingLabel, getPrimaryBlogTag } from "@/lib/data/blogs";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: BlogMetadata;
  index: number;
  selectedTags: string[];
  variant?: "default" | "featured";
}

export function BlogCard({
  blog,
  index,
  selectedTags,
  variant = "default",
}: BlogCardProps) {
  const isFeatured = variant === "featured";
  const readingTime = blog.stats?.readingTime ?? 0;
  const primaryTag = getPrimaryBlogTag(blog);
  const formatLabel = getBlogFormatLabel(blog);
  const readingLabel = getBlogReadingLabel(blog);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/blogs/${blog.slug}`} className="group block">
        <article
          className={cn(
            "relative w-full overflow-hidden border border-border bg-[#0a0a0f] transition-all duration-300 cyber-chamfer",
            isFeatured ? "p-6 md:p-7 hover:border-accent-tertiary" : "p-5 md:p-6 hover:border-accent",
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-accent/[0.02] opacity-0 transition-opacity group-hover:opacity-100" />
          <div
            className={cn(
              "absolute left-0 top-0 h-1 w-full transition-all",
              isFeatured
                ? "bg-accent-tertiary/10 group-hover:bg-accent-tertiary group-hover:shadow-[0_0_10px_#00d4ff]"
                : "bg-accent/10 group-hover:bg-accent group-hover:shadow-[0_0_10px_#00ff88]",
            )}
          />

          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <time className="border border-accent-secondary/20 bg-accent-secondary/5 px-2 py-0.5 font-mono text-[10px] text-accent-secondary">
              [{blog.date}]
            </time>
            {readingTime > 0 ? (
              <span className="border border-border bg-card/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                {readingTime.toString().padStart(2, "0")} MIN
              </span>
            ) : null}
            <span className="border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
              {formatLabel}
            </span>
            <span className="border border-border bg-card/30 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {readingLabel}
            </span>
          </div>

          <div className="relative z-10 mt-4 space-y-3">
            <div className="space-y-2">
              <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-accent-tertiary">
                {primaryTag}
              </span>
              <h2
                className={cn(
                  "font-sans font-bold leading-tight text-foreground transition-colors",
                  isFeatured ? "text-xl md:text-2xl group-hover:text-accent-tertiary" : "text-lg md:text-2xl group-hover:text-accent",
                )}
              >
                {blog.title}
              </h2>
            </div>

            <p
              className={cn(
                "font-mono leading-relaxed text-muted-foreground",
                isFeatured ? "line-clamp-3 text-sm" : "line-clamp-2 text-sm",
              )}
            >
              {blog.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {blog.tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "border px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest",
                    selectedTags.includes(tag)
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-card/30 text-muted-foreground",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
            <span>{isFeatured ? "Open Highlight" : "Initiate Read Sequence"}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
