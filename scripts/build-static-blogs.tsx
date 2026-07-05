import fs from "fs/promises";
import path from "path";
import React, { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MDXComponents } from "mdx/types";
import relations from "../public/relations.json";
import { BlogContent } from "../components/organisms/BlogContent";
import { mdxComponents } from "../components/molecules/MDXComponents";
import { getBlogAudioEntry } from "../lib/audio/read";
import { getBlogCompiledMdx } from "../lib/compiled-mdx-cache";
import { renderCompiledMdx } from "../lib/compiled-mdx-render";
import {
  getAllBlogSlugs,
  getBlogData,
  getBlogsBySlugs,
  getSortedBlogsData,
} from "../lib/mdx";
import { renderStaticAppShellDocument } from "./static-content-shell";
import type { Blog, BlogMetadata, TocHeading } from "../types";

const PREVIEW_OUTPUT_DIR = path.join(process.cwd(), ".cache", "static-blogs-preview");

const staticMdxComponents: MDXComponents = {
  pre: ({ children }) => <>{children}</>,
  code: ({ children, className, ...props }: any) => {
    const codeString = Array.isArray(children) ? children.join("") : String(children ?? "");

    if (className === "language-mermaid" || className === "mermaid") {
      return (
        <figure className="diagram-block">
          <figcaption>Mermaid Source</figcaption>
          <pre className="code-block">
            <code {...props}>{codeString}</code>
          </pre>
        </figure>
      );
    }

    if (className) {
      return (
        <pre className="code-block">
          <code className={className} {...props}>
            {codeString}
          </code>
        </pre>
      );
    }

    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  },
  h2: (props: any) => (
    <h2
      {...props}
      id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
    />
  ),
  h3: (props: any) => (
    <h3
      {...props}
      id={props.id || props.children?.toString().toLowerCase().replace(/\s+/g, "-")}
    />
  ),
  table: (props: any) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  th: (props: any) => <th {...props} />,
  td: (props: any) => <td {...props} />,
};

function getDocumentStyles() {
  return `
    :root {
      color-scheme: dark;
      --bg: #071116;
      --panel: #0d1b22;
      --border: rgba(120, 189, 224, 0.18);
      --text: #e6f1f5;
      --muted: #9fb7c3;
      --accent: #65d2ff;
      --accent-soft: rgba(101, 210, 255, 0.12);
      --accent-secondary: #8ef7b3;
      --shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      font-family: Inter, system-ui, sans-serif;
      background:
        radial-gradient(circle at top, rgba(101, 210, 255, 0.12), transparent 28%),
        linear-gradient(180deg, #081219 0%, var(--bg) 100%);
      color: var(--text);
    }
    a { color: inherit; text-decoration: none; }
    .page-shell {
      max-width: 1440px;
      margin: 0 auto;
      padding: 32px 16px 72px;
    }
    .stack { display: grid; gap: 24px; }
    .hero,
    .panel,
    .article-shell,
    .toc-panel,
    .related-panel {
      border: 1px solid var(--border);
      background: rgba(13, 27, 34, 0.88);
      box-shadow: var(--shadow);
      backdrop-filter: blur(14px);
      padding: 20px;
    }
    .hero { display: grid; gap: 16px; }
    .eyebrow, .meta, .tag-row, .list-label {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--muted);
    }
    .pill, .tag, .link-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
    }
    .pill.accent, .link-chip.primary {
      color: var(--accent);
      background: var(--accent-soft);
      border-color: rgba(101, 210, 255, 0.28);
    }
    .pill.secondary {
      color: var(--accent-secondary);
      border-color: rgba(142, 247, 179, 0.28);
      background: rgba(142, 247, 179, 0.08);
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 3vw, 3.5rem);
      line-height: 1.02;
      letter-spacing: -0.04em;
    }
    h2, h3, h4, p { margin-top: 0; }
    .lede {
      max-width: 78ch;
      font-size: 1rem;
      line-height: 1.75;
      color: var(--muted);
    }
    .card-grid,
    .related-grid {
      display: grid;
      gap: 16px;
    }
    .blog-card,
    .related-card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.025);
      padding: 16px;
      transition: border-color 140ms ease, transform 140ms ease;
    }
    .blog-card:hover,
    .related-card:hover {
      border-color: rgba(101, 210, 255, 0.42);
      transform: translateY(-1px);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .kicker {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--accent);
    }
    .minor {
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.65;
    }
    .split-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .article-prose {
      max-width: 74ch;
      font-size: 1rem;
      line-height: 1.85;
      color: var(--text);
    }
    .article-prose > * + * { margin-top: 1.15em; }
    .article-prose h2,
    .article-prose h3 {
      scroll-margin-top: 24px;
      line-height: 1.2;
    }
    .article-prose h2 { margin-top: 2em; font-size: 1.7rem; }
    .article-prose h3 { margin-top: 1.6em; font-size: 1.25rem; }
    .article-prose p,
    .article-prose li,
    .article-prose blockquote {
      color: #dbe6eb;
    }
    .article-prose ul,
    .article-prose ol {
      padding-left: 1.35rem;
    }
    .article-prose a {
      color: var(--accent);
      text-decoration: underline;
      text-decoration-color: rgba(101, 210, 255, 0.35);
    }
    .inline-code {
      padding: 0.18rem 0.4rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.92em;
    }
    .code-block {
      overflow-x: auto;
      padding: 16px;
      border: 1px solid var(--border);
      background: #061018;
      color: #c6efff;
      line-height: 1.65;
    }
    .diagram-block {
      display: grid;
      gap: 10px;
      margin: 1.2rem 0;
    }
    .diagram-block figcaption {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--muted);
    }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }
    th {
      color: var(--accent);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }
    .toc-list, .related-list {
      display: grid;
      gap: 10px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .toc-list a, .related-list a {
      display: block;
      padding: 10px 12px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
      color: var(--muted);
    }
    .toc-list a:hover, .related-list a:hover {
      color: var(--text);
      border-color: rgba(101, 210, 255, 0.45);
    }
    @media (min-width: 920px) {
      .page-shell { padding: 40px 24px 80px; }
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .split-layout { grid-template-columns: 240px minmax(0, 1fr) 240px; align-items: start; }
      .hero, .panel, .article-shell, .toc-panel, .related-panel { padding: 24px; }
    }
  `;
}

async function renderDocument({
  title,
  description,
  children,
  shellOutputRoot,
}: {
  title: string;
  description: string;
  children: ReactNode;
  shellOutputRoot?: string;
}) {
  const contentHtml = renderToStaticMarkup(children);

  if (shellOutputRoot) {
    return renderStaticAppShellDocument({
      outputRoot: shellOutputRoot,
      title,
      description,
      contentHtml,
    });
  }

  return `<!DOCTYPE html>${renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <style>{getDocumentStyles()}</style>
      </head>
      <body>{children}</body>
    </html>,
  )}`;
}

async function writeTextFile(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

function isAllowedOutputDirectory(targetDir: string) {
  const normalizedTarget = path.normalize(targetDir);
  const allowedRoots = [
    path.normalize(path.join(process.cwd(), ".cache")),
    path.normalize(path.join(process.cwd(), "out")),
  ];

  return allowedRoots.some((root) => normalizedTarget.startsWith(root));
}

async function resetOutputDirectory(targetDir: string) {
  if (!isAllowedOutputDirectory(targetDir)) {
    throw new Error(`Refusing to reset unexpected output directory: ${targetDir}`);
  }

  await fs.rm(targetDir, { recursive: true, force: true });
  await fs.mkdir(targetDir, { recursive: true });
}

async function renderBlogsIndex(blogs: BlogMetadata[], shellOutputRoot?: string) {
  return renderDocument({
    title: "Logs",
    description: "Technical deep-dives, system notes, and engineering logs.",
    shellOutputRoot,
    children: (
      <main className="page-shell stack">
        <section className="hero">
          <div className="eyebrow">
            <span className="pill accent">Logs</span>
            <span className="pill">Static export</span>
          </div>
          <h1>Technical Archive</h1>
          <p className="lede">
            Browse technical essays, architectural fragments, and operational notes
            in a lightweight static archive.
          </p>
        </section>

        <section className="panel stack">
          <div className="eyebrow">
            <span className="pill secondary">{blogs.length} entries</span>
          </div>
          <div className="card-grid">
            {blogs.map((blog) => (
              <a key={blog.slug} href={`./${blog.slug}/index.html`} className="blog-card">
                <div className="card-header">
                  <div>
                    <div className="kicker">{blog.date}</div>
                    <h2>{blog.title}</h2>
                  </div>
                  <span className="pill">{blog.stats?.readingTime || 0} min</span>
                </div>
                <p className="minor">{blog.description}</p>
                <div className="tag-row">
                  {blog.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    ),
  });
}

async function renderBlogPost({
  post,
  headings,
  article,
  relatedPosts,
  audioEntry,
  shellOutputRoot,
}: {
  post: Blog;
  headings: TocHeading[];
  article: ReactNode;
  relatedPosts: BlogMetadata[];
  audioEntry: ReturnType<typeof getBlogAudioEntry>;
  shellOutputRoot?: string;
}) {
  return renderDocument({
    title: `${post.title} | Logs`,
    description: post.description,
    shellOutputRoot,
    children: (
      <BlogContent
        postData={post}
        headings={headings}
        relatedPosts={relatedPosts}
        audioEntry={audioEntry}
      >
        {article}
      </BlogContent>
    ),
  });
}

export async function buildStaticBlogsOutput({
  outputDir,
  outputLabel,
  writeSummary = true,
  includeIndexPage = true,
  resetOutputDir = true,
  shellOutputRoot,
}: {
  outputDir: string;
  outputLabel: string;
  writeSummary?: boolean;
  includeIndexPage?: boolean;
  resetOutputDir?: boolean;
  shellOutputRoot?: string;
}) {
  if (resetOutputDir) {
    await resetOutputDirectory(outputDir);
  } else {
    await fs.mkdir(outputDir, { recursive: true });
  }

  const blogs = getSortedBlogsData();
  const slugs = getAllBlogSlugs();

  if (includeIndexPage) {
    await writeTextFile(
      path.join(outputDir, "index.html"),
      await renderBlogsIndex(blogs, shellOutputRoot),
    );
  }

  for (const { slug } of slugs) {
    const post = await getBlogData(slug);
    const compiledMdx = await getBlogCompiledMdx(slug);
    const relatedSlugs = (relations as Record<string, { slug: string }[]>)[slug] || [];
    const relatedPosts = getBlogsBySlugs(relatedSlugs.map((entry) => entry.slug));
    const audioEntry = getBlogAudioEntry(slug);
    const article = renderCompiledMdx(compiledMdx, mdxComponents);

    await writeTextFile(
      path.join(outputDir, slug, "index.html"),
      await renderBlogPost({
        post,
        headings: compiledMdx.headings,
        article,
        relatedPosts,
        audioEntry,
        shellOutputRoot,
      }),
    );
  }

  if (writeSummary) {
    await writeTextFile(
      path.join(outputDir, "summary.json"),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          totalBlogs: blogs.length,
          outputDir: path.relative(process.cwd(), outputDir).split(path.sep).join("/"),
        },
        null,
        2,
      ),
    );
  }

  console.log(
    `${outputLabel}: ${path.relative(process.cwd(), outputDir)} (${blogs.length} blog pages)`,
  );
}

if (import.meta.main) {
  buildStaticBlogsOutput({
    outputDir: PREVIEW_OUTPUT_DIR,
    outputLabel: "Static blogs preview ready",
    writeSummary: true,
  }).catch((error) => {
    console.error("Failed building static blogs preview:", error);
    process.exitCode = 1;
  });
}
