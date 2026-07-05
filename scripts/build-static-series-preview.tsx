import fs from "fs/promises";
import path from "path";
import React, { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MDXComponents } from "mdx/types";
import { getSeriesPartCompiledMdx } from "../lib/compiled-mdx-cache";
import { renderCompiledMdx } from "../lib/compiled-mdx-render";
import { getSeriesGroupForPart, groupSeriesParts } from "../lib/series-navigation";
import { getAllSeriesSlugs, getSeriesBySlug, getSeriesCatalog } from "../lib/series";
import type {
  SeriesCatalogSection,
  SeriesDetail,
  SeriesPartSummary,
  TocHeading,
} from "../types";

const PREVIEW_OUTPUT_DIR = path.join(process.cwd(), ".cache", "static-series-preview");

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
      --panel-strong: #10232d;
      --border: rgba(120, 189, 224, 0.18);
      --text: #e6f1f5;
      --muted: #9fb7c3;
      --accent: #65d2ff;
      --accent-soft: rgba(101, 210, 255, 0.12);
      --accent-strong: #8ef7b3;
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
      max-width: 1480px;
      margin: 0 auto;
      padding: 32px 16px 64px;
    }
    .stack { display: grid; gap: 24px; }
    .hero,
    .panel,
    .article-shell,
    .toc-panel,
    .sidebar-panel {
      border: 1px solid var(--border);
      background: rgba(13, 27, 34, 0.88);
      box-shadow: var(--shadow);
      backdrop-filter: blur(14px);
    }
    .hero,
    .panel,
    .toc-panel,
    .sidebar-panel {
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
    .pill.positive {
      color: var(--accent-strong);
      border-color: rgba(142, 247, 179, 0.28);
      background: rgba(142, 247, 179, 0.08);
    }
    h1 {
      margin: 0;
      font-size: clamp(2rem, 3.2vw, 3.8rem);
      line-height: 1.02;
      letter-spacing: -0.04em;
    }
    h2, h3, h4, p { margin-top: 0; }
    .lede {
      max-width: 76ch;
      font-size: 1rem;
      line-height: 1.75;
      color: var(--muted);
    }
    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .link-chip:hover {
      border-color: rgba(101, 210, 255, 0.45);
      color: var(--accent);
    }
    .section-grid,
    .card-grid,
    .phase-grid,
    .lesson-grid {
      display: grid;
      gap: 16px;
    }
    .series-card,
    .lesson-card,
    .phase-card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.025);
      padding: 16px;
    }
    .series-card:hover,
    .lesson-card:hover {
      border-color: rgba(101, 210, 255, 0.42);
      transform: translateY(-1px);
    }
    .series-card,
    .lesson-card {
      transition: border-color 140ms ease, transform 140ms ease;
    }
    .series-header,
    .lesson-header {
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
    .article-shell {
      padding: 20px;
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
    .toc-list,
    .sidebar-list {
      display: grid;
      gap: 10px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .sidebar-list a,
    .toc-list a {
      display: block;
      padding: 10px 12px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
      color: var(--muted);
    }
    .sidebar-list a.active,
    .toc-list a:hover {
      color: var(--text);
      border-color: rgba(101, 210, 255, 0.45);
    }
    .sidebar-list a.active {
      color: var(--accent);
      background: var(--accent-soft);
    }
    .empty-note {
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.6;
    }
    @media (min-width: 920px) {
      .page-shell { padding: 40px 24px 80px; }
      .section-grid { gap: 20px; }
      .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .lesson-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .phase-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .split-layout { grid-template-columns: 280px minmax(0, 1fr) 240px; align-items: start; }
      .article-shell { padding: 28px; }
      .hero, .panel, .toc-panel, .sidebar-panel { padding: 24px; }
    }
  `;
}

function formatDateLabel(value: string) {
  return value || "Undated";
}

function formatCount(value: number, label: string) {
  return `${value.toString().padStart(2, "0")} ${label}`;
}

async function writeTextFile(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}

function renderDocument({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
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

function renderCatalogIndex(sections: SeriesCatalogSection[]) {
  return renderDocument({
    title: "Series",
    description: "Structured learning series.",
    children: (
      <main className="page-shell stack">
        <section className="hero">
          <div className="eyebrow">
            <span className="pill accent">Series</span>
            <span className="pill">Static export</span>
          </div>
          <h1>Structured Learning Tracks</h1>
          <p className="lede">
            Browse curated series, jump into a curriculum map, or go directly to
            the newest lesson in a track.
          </p>
        </section>

        <section className="section-grid">
          {sections.map((section) => {
            const items = [...section.featured, ...section.items];

            return (
              <div key={section.id} className="panel stack">
                <div className="stack" style={{ gap: 10 }}>
                  <div className="eyebrow">
                    <span className="pill">{section.id}</span>
                    <span>{formatCount(items.length, "tracks")}</span>
                  </div>
                  <div>
                    <h2>{section.title}</h2>
                    {section.subtitle ? <p className="minor">{section.subtitle}</p> : null}
                    {section.description ? <p className="minor">{section.description}</p> : null}
                  </div>
                </div>

                <div className="card-grid">
                  {items.map((series) => (
                    <a
                      key={series.seriesSlug}
                      href={`./${series.seriesSlug}/index.html`}
                      className="series-card"
                    >
                      <div className="series-header">
                        <div>
                          <div className="kicker">{series.featuredLabel || section.title}</div>
                          <h3>{series.seriesTitle}</h3>
                        </div>
                        <span className="pill">{series.totalParts} lessons</span>
                      </div>
                      <p className="minor">{series.description}</p>
                      <div className="tag-row">
                        <span className="pill accent">{series.totalReadingTime} min total</span>
                        <span className="pill">{formatDateLabel(series.lastUpdated)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    ),
  });
}

function renderSeriesIndex(series: SeriesDetail) {
  return renderDocument({
    title: `${series.summary.seriesTitle} | Series`,
    description: series.summary.description,
    children: (
      <main className="page-shell stack">
        <section className="hero">
          <div className="eyebrow">
            <a href="../index.html" className="link-chip">
              All series
            </a>
            <span className="pill accent">
              {formatCount(series.summary.totalParts, "lessons")}
            </span>
            <span className="pill positive">{series.summary.totalReadingTime} min</span>
          </div>
          <h1>{series.summary.seriesTitle}</h1>
          <p className="lede">{series.summary.description}</p>
          <div className="cta-row">
            <a
              href={`./${series.summary.firstPartSlug}/index.html`}
              className="link-chip primary"
            >
              Start from lesson 01
            </a>
            <a
              href={`./${series.summary.latestPartSlug}/index.html`}
              className="link-chip"
            >
              Jump to latest lesson
            </a>
          </div>
          <div className="tag-row">
            {series.summary.tags.map((tag) => (
              <span key={tag} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </section>

        <section className="phase-grid">
          {series.phases.map((phase) => (
            <div key={phase.id} className="phase-card stack" style={{ gap: 14 }}>
              <div className="eyebrow">
                <span className="pill accent">
                  {phase.fromOrder.toString().padStart(2, "0")}–
                  {phase.toOrder.toString().padStart(2, "0")}
                </span>
                <span>{formatCount(phase.totalParts, "lessons")}</span>
              </div>
              <div>
                <h2>{phase.title}</h2>
                {phase.subtitle ? <p className="minor">{phase.subtitle}</p> : null}
                {phase.description ? <p className="minor">{phase.description}</p> : null}
              </div>
              <div className="cta-row">
                <a href={`./${phase.firstPartSlug}/index.html`} className="link-chip primary">
                  Open phase start
                </a>
                <a href={`./${phase.lastPartSlug}/index.html`} className="link-chip">
                  Open phase end
                </a>
              </div>
            </div>
          ))}
        </section>

        <section className="panel stack">
          <div className="eyebrow">
            <span className="pill">Curriculum map</span>
            <span>{formatCount(series.parts.length, "lessons")}</span>
          </div>
          <div className="lesson-grid">
            {series.parts.map((part) => (
              <a key={part.slug} href={`./${part.slug}/index.html`} className="lesson-card">
                <div className="lesson-header">
                  <div>
                    <div className="kicker">
                      Lesson {part.order.toString().padStart(2, "0")}
                    </div>
                    <h3>{part.partTitle || part.title}</h3>
                  </div>
                  <span className="pill">{part.stats.readingTime} min</span>
                </div>
                <p className="minor">{part.description}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    ),
  });
}

function renderPartPage({
  series,
  part,
  headings,
  article,
  previousPart,
  nextPart,
}: {
  series: SeriesDetail;
  part: SeriesPartSummary;
  headings: TocHeading[];
  article: ReactNode;
  previousPart: SeriesPartSummary | null;
  nextPart: SeriesPartSummary | null;
}) {
  const groups = groupSeriesParts(series.parts);
  const currentGroup = getSeriesGroupForPart(groups, part.slug);
  const displayTitle = part.partTitle || part.title;
  const visibleHeadings = headings.slice(1);

  return renderDocument({
    title: `${displayTitle} | ${part.seriesTitle}`,
    description: part.description,
    children: (
      <main className="page-shell stack">
        <section className="hero">
          <div className="eyebrow">
            <a href="../../index.html" className="link-chip">
              All series
            </a>
            <a href="../index.html" className="link-chip">
              {part.seriesTitle}
            </a>
            <span className="pill accent">
              Lesson {part.order.toString().padStart(2, "0")} /{" "}
              {series.parts.length.toString().padStart(2, "0")}
            </span>
          </div>
          <h1>{displayTitle}</h1>
          {displayTitle !== part.title ? <p className="minor">{part.title}</p> : null}
          <p className="lede">{part.description}</p>
          <div className="meta">
            {currentGroup ? <span className="pill">{currentGroup.title}</span> : null}
            <span className="pill positive">{part.stats.readingTime} min read</span>
            <span className="pill">{part.stats.wordCount} words</span>
            <span className="pill">{formatDateLabel(part.date)}</span>
          </div>
          <div className="cta-row">
            {previousPart ? (
              <a href={`../${previousPart.slug}/index.html`} className="link-chip">
                Previous lesson
              </a>
            ) : null}
            {nextPart ? (
              <a href={`../${nextPart.slug}/index.html`} className="link-chip primary">
                Next lesson
              </a>
            ) : null}
            <a href="../index.html" className="link-chip">
              Open curriculum map
            </a>
          </div>
        </section>

        <section className="split-layout">
          <aside className="sidebar-panel stack" style={{ gap: 16 }}>
            <div className="list-label">
              <span className="pill accent">Learning Flow</span>
            </div>
            <ul className="sidebar-list">
              {series.parts.map((seriesPart) => (
                <li key={seriesPart.slug}>
                  <a
                    href={`../${seriesPart.slug}/index.html`}
                    className={seriesPart.slug === part.slug ? "active" : undefined}
                  >
                    {seriesPart.order.toString().padStart(2, "0")} —{" "}
                    {seriesPart.partTitle || seriesPart.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <article className="article-shell">
            <div className="article-prose">{article}</div>
          </article>

          <aside className="toc-panel stack" style={{ gap: 16 }}>
            <div className="list-label">
              <span className="pill accent">On This Page</span>
            </div>
            {visibleHeadings.length > 0 ? (
              <ul className="toc-list">
                {visibleHeadings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-note">
                This lesson is compact, so the page does not need a longer table of
                contents.
              </p>
            )}
          </aside>
        </section>
      </main>
    ),
  });
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

export async function buildStaticSeriesOutput({
  outputDir,
  outputLabel,
  writeSummary = true,
}: {
  outputDir: string;
  outputLabel: string;
  writeSummary?: boolean;
}) {
  await resetOutputDirectory(outputDir);

  const catalog = getSeriesCatalog();
  const slugs = getAllSeriesSlugs();
  let renderedPartCount = 0;

  await writeTextFile(path.join(outputDir, "index.html"), renderCatalogIndex(catalog));

  for (const { seriesSlug } of slugs) {
    const series = getSeriesBySlug(seriesSlug);
    if (!series) {
      continue;
    }

    await writeTextFile(path.join(outputDir, seriesSlug, "index.html"), renderSeriesIndex(series));

    for (const part of series.parts) {
      const compiledMdx = await getSeriesPartCompiledMdx(seriesSlug, part.slug);
      if (!compiledMdx) {
        throw new Error(`Missing compiled MDX cache for ${seriesSlug}/${part.slug}`);
      }

      const currentIndex = series.parts.findIndex((entry) => entry.slug === part.slug);
      const previousPart = currentIndex > 0 ? series.parts[currentIndex - 1] : null;
      const nextPart =
        currentIndex >= 0 && currentIndex < series.parts.length - 1
          ? series.parts[currentIndex + 1]
          : null;

      const article = renderCompiledMdx(compiledMdx, staticMdxComponents);
      const html = renderPartPage({
        series,
        part,
        headings: compiledMdx.headings,
        article,
        previousPart,
        nextPart,
      });

      await writeTextFile(path.join(outputDir, seriesSlug, part.slug, "index.html"), html);
      renderedPartCount += 1;
    }
  }

  if (writeSummary) {
    await writeTextFile(
      path.join(outputDir, "summary.json"),
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          totalSections: catalog.length,
          totalSeries: slugs.length,
          totalParts: renderedPartCount,
          outputDir: path.relative(process.cwd(), outputDir).split(path.sep).join("/"),
        },
        null,
        2,
      ),
    );
  }

  console.log(
    `${outputLabel}: ${path.relative(process.cwd(), outputDir)} (${slugs.length} series / ${renderedPartCount} parts)`,
  );
}

if (import.meta.main) {
  buildStaticSeriesOutput({
    outputDir: PREVIEW_OUTPUT_DIR,
    outputLabel: "Static series preview ready",
    writeSummary: true,
  }).catch((error) => {
    console.error("Failed building static series preview:", error);
    process.exitCode = 1;
  });
}
