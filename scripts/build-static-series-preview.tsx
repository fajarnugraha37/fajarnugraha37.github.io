import fs from "fs/promises";
import path from "path";
import React, { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MDXComponents } from "mdx/types";
import { SeriesPartContent } from "../components/organisms/SeriesPartContent";
import { getSeriesPartAudioEntry } from "../lib/audio/read";
import { getSeriesPartCompiledMdx } from "../lib/compiled-mdx-cache";
import { renderCompiledMdx } from "../lib/compiled-mdx-render";
import { getSeriesGroupForPart, groupSeriesParts } from "../lib/series-navigation";
import { getAllSeriesSlugs, getSeriesBySlug, getSeriesCatalog } from "../lib/series";
import { renderStaticAppShellDocument } from "./static-content-shell";
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
        <figure className="diagram-block mermaid-block">
          <div className="mermaid-header">
            <figcaption className="mermaid-caption">Mermaid Diagram</figcaption>
            <div className="mermaid-toolbar" data-mermaid-toolbar>
              <button type="button" data-mermaid-action="zoom">
                Zoom
              </button>
              <button type="button" data-mermaid-action="copy">
                Copy
              </button>
              <button type="button" data-mermaid-action="svg">
                SVG
              </button>
              <button type="button" data-mermaid-action="png">
                PNG
              </button>
            </div>
          </div>
          <div className="mermaid-static" data-mermaid-source {...props}>
            {codeString}
          </div>
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
    .mermaid-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .mermaid-block {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.025);
      padding: 16px;
    }
    .mermaid-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .mermaid-toolbar button {
      appearance: none;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.04);
      color: var(--muted);
      padding: 6px 10px;
      font: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
    }
    .mermaid-toolbar button:hover {
      color: var(--text);
      border-color: rgba(101, 210, 255, 0.45);
      background: rgba(101, 210, 255, 0.12);
    }
    .mermaid-static {
      display: flex;
      justify-content: center;
      overflow-x: auto;
      color: var(--muted);
      min-height: 120px;
    }
    .mermaid-static svg {
      max-width: 100%;
      height: auto;
    }
    .mermaid-static[data-mermaid-error="true"] {
      display: block;
    }
    .mermaid-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(10px);
    }
    .mermaid-modal[data-open="true"] {
      display: flex;
    }
    .mermaid-modal-card {
      width: min(1200px, 100%);
      max-height: min(88vh, 100%);
      overflow: auto;
      border: 1px solid var(--border);
      background: #081219;
      box-shadow: var(--shadow);
      padding: 20px;
    }
    .mermaid-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 16px;
    }
    .mermaid-modal-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .mermaid-modal-stage {
      overflow: auto;
    }
    .mermaid-modal-stage svg {
      max-width: none;
      height: auto;
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

function getMermaidEnhancerStyles() {
  return `
    .mermaid-header {
      position: absolute;
      top: 8px;
      right: 8px;
      left: 8px;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      pointer-events: none;
    }
    .mermaid-block {
      position: relative;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: rgba(15, 23, 42, 0.45);
      padding: 16px;
      border-radius: 16px;
      margin: 1.2rem 0;
    }
    .mermaid-toolbar,
    .mermaid-modal-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .mermaid-toolbar {
      pointer-events: auto;
      padding: 4px;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 10px;
      background: rgba(8, 18, 25, 0.88);
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
    }
    .mermaid-toolbar button,
    .mermaid-modal-actions button {
      appearance: none;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: rgba(255, 255, 255, 0.04);
      color: rgba(226, 232, 240, 0.88);
      min-width: 34px;
      height: 34px;
      padding: 0 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font: inherit;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      cursor: pointer;
      transition:
        background 140ms ease,
        color 140ms ease,
        border-color 140ms ease;
    }
    .mermaid-toolbar button:hover,
    .mermaid-modal-actions button:hover {
      color: #081219;
      border-color: rgba(101, 210, 255, 0.45);
      background: #65d2ff;
    }
    .mermaid-static {
      display: flex;
      justify-content: center;
      overflow-x: auto;
      min-height: 120px;
      padding-top: 34px;
    }
    .mermaid-static svg {
      max-width: 100%;
      height: auto;
    }
    .mermaid-static[data-mermaid-error="true"] {
      display: block;
      padding-top: 34px;
    }
    .mermaid-modal {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(10px);
    }
    .mermaid-modal[data-open="true"] {
      display: flex;
    }
    .mermaid-modal-card {
      width: min(1200px, 100%);
      max-height: min(88vh, 100%);
      overflow: auto;
      border: 1px solid rgba(148, 163, 184, 0.22);
      background: #081219;
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
      padding: 0;
    }
    .mermaid-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      background: rgba(8, 18, 25, 0.72);
      backdrop-filter: blur(12px);
    }
    .mermaid-modal-stage {
      width: 100%;
      height: min(72vh, 100%);
      overflow: auto;
      cursor: grab;
      padding: 24px;
    }
    .mermaid-modal-stage.is-dragging {
      cursor: grabbing;
    }
    .mermaid-modal-canvas {
      width: fit-content;
      min-width: 100%;
      min-height: 100%;
      margin: 0 auto;
    }
    .mermaid-modal-stage svg {
      max-width: none;
      height: auto;
    }
    .mermaid-caption {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 34px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid rgba(101, 210, 255, 0.2);
      background: rgba(8, 18, 25, 0.88);
      color: rgba(226, 232, 240, 0.78);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      pointer-events: auto;
    }
  `;
}

function getMermaidEnhancerScript() {
  return `
    <script type="module">
      const blocks = Array.from(document.querySelectorAll('.mermaid-static[data-mermaid-source]'));
      if (blocks.length > 0) {
        const modal = document.createElement('div');
        modal.className = 'mermaid-modal';
        modal.innerHTML = [
          '<div class="mermaid-modal-card">',
          '  <div class="mermaid-modal-header">',
          '    <strong>Mermaid Diagram</strong>',
          '    <div class="mermaid-modal-actions">',
          '      <button type="button" data-modal-action="zoom-in" aria-label="Zoom in">+</button>',
          '      <button type="button" data-modal-action="zoom-out" aria-label="Zoom out">-</button>',
          '      <button type="button" data-modal-action="reset" aria-label="Reset zoom">Reset</button>',
          '      <button type="button" data-modal-action="close" aria-label="Close viewer">×</button>',
          '    </div>',
          '  </div>',
          '  <div class="mermaid-modal-stage"><div class="mermaid-modal-canvas"></div></div>',
          '</div>',
        ].join('');
        document.body.appendChild(modal);

        const modalStage = modal.querySelector('.mermaid-modal-stage');
        const modalCanvas = modal.querySelector('.mermaid-modal-canvas');
        let modalScale = 1;
        let dragState = null;

        const syncCanvasSize = () => {
          const svg = modalCanvas.querySelector('svg');
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          modalCanvas.style.width = Math.max(rect.width, modalStage.clientWidth - 48) + 'px';
          modalCanvas.style.height = Math.max(rect.height, modalStage.clientHeight - 48) + 'px';
        };

        const setModalScale = (scale) => {
          modalScale = scale;
          const svg = modalCanvas.querySelector('svg');
          if (svg) {
            svg.style.transform = 'scale(' + modalScale + ')';
            svg.style.transformOrigin = 'top left';
            syncCanvasSize();
          }
        };

        const closeModal = () => {
          modal.dataset.open = 'false';
          modalCanvas.innerHTML = '';
          modalCanvas.style.width = '';
          modalCanvas.style.height = '';
          modalScale = 1;
        };

        modal.addEventListener('click', (event) => {
          if (event.target === modal) closeModal();
        });

        modal.querySelector('[data-modal-action="close"]').addEventListener('click', closeModal);
        modal.querySelector('[data-modal-action="zoom-in"]').addEventListener('click', () => setModalScale(modalScale + 0.15));
        modal.querySelector('[data-modal-action="zoom-out"]').addEventListener('click', () => setModalScale(Math.max(0.3, modalScale - 0.15)));
        modal.querySelector('[data-modal-action="reset"]').addEventListener('click', () => setModalScale(1));

        modalStage.addEventListener('pointerdown', (event) => {
          if (event.button !== 0) return;
          dragState = {
            x: event.clientX,
            y: event.clientY,
            left: modalStage.scrollLeft,
            top: modalStage.scrollTop,
          };
          modalStage.classList.add('is-dragging');
        });

        window.addEventListener('pointermove', (event) => {
          if (!dragState) return;
          modalStage.scrollLeft = dragState.left - (event.clientX - dragState.x);
          modalStage.scrollTop = dragState.top - (event.clientY - dragState.y);
        });

        const stopDragging = () => {
          dragState = null;
          modalStage.classList.remove('is-dragging');
        };

        window.addEventListener('pointerup', stopDragging);
        window.addEventListener('pointercancel', stopDragging);

        const copyText = async (value) => {
          try {
            await navigator.clipboard.writeText(value);
          } catch (error) {
            console.error('Failed copying Mermaid source', error);
          }
        };

        const downloadSvg = (svgMarkup, fileName) => {
          const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.click();
          URL.revokeObjectURL(url);
        };

        const downloadPng = (svgMarkup, fileName) => {
          const img = new Image();
          const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);

          img.onload = () => {
            const width = img.width || 1600;
            const height = img.height || 900;
            const canvas = document.createElement('canvas');
            canvas.width = width * 2;
            canvas.height = height * 2;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#081219';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.scale(2, 2);
              ctx.drawImage(img, 0, 0, width, height);
              const pngUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = pngUrl;
              link.download = fileName;
              link.click();
            }
            URL.revokeObjectURL(url);
          };

          img.src = url;
        };

        const run = async () => {
          try {
            const mermaid = (await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')).default;
            mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });

            for (const [index, block] of blocks.entries()) {
              const source = block.textContent || '';
              block.dataset.mermaidSource = source;

              try {
                const { svg, bindFunctions } = await mermaid.render('mermaid-static-series-' + index, source);
                block.innerHTML = svg;
                bindFunctions?.(block);
              } catch (error) {
                block.setAttribute('data-mermaid-error', 'true');
                block.innerHTML = '<pre class="code-block"><code></code></pre>';
                const code = block.querySelector('code');
                if (code) code.textContent = source;
                console.error('Failed rendering Mermaid diagram', error);
              }

              const figure = block.closest('.mermaid-block');
              const toolbar = figure?.querySelector('[data-mermaid-toolbar]');
              const getSvgMarkup = () => block.innerHTML;
              const safeBaseName = 'mermaid-diagram-' + String(index + 1).padStart(2, '0');

              toolbar?.addEventListener('click', async (event) => {
                const action = event.target?.closest('button')?.dataset?.mermaidAction;
                if (!action) return;

                if (action === 'copy') {
                  await copyText(block.dataset.mermaidSource || '');
                  return;
                }

                if (action === 'svg') {
                  downloadSvg(getSvgMarkup(), safeBaseName + '.svg');
                  return;
                }

                if (action === 'png') {
                  downloadPng(getSvgMarkup(), safeBaseName + '.png');
                  return;
                }

                if (action === 'zoom') {
                  modalCanvas.innerHTML = getSvgMarkup();
                  modal.dataset.open = 'true';
                  setModalScale(1);
                  modalStage.scrollTop = 0;
                  modalStage.scrollLeft = 0;
                }
              });
            }
          } catch (error) {
            console.error('Failed loading Mermaid runtime', error);
          }
        };

        run();
      }
    </script>
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
  const contentHtml = `${renderToStaticMarkup(children)}${getMermaidEnhancerScript()}`;

  if (shellOutputRoot) {
    return renderStaticAppShellDocument({
      outputRoot: shellOutputRoot,
      title,
      description,
      contentHtml,
      headHtml: `<style>${getMermaidEnhancerStyles()}</style>`,
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

async function renderCatalogIndex(
  sections: SeriesCatalogSection[],
  shellOutputRoot?: string,
) {
  return renderDocument({
    title: "Series",
    description: "Structured learning series.",
    shellOutputRoot,
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

async function renderSeriesIndex(series: SeriesDetail, shellOutputRoot?: string) {
  return renderDocument({
    title: `${series.summary.seriesTitle} | Series`,
    description: series.summary.description,
    shellOutputRoot,
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

async function renderPartPage({
  series,
  part,
  headings,
  article,
  previousPart,
  nextPart,
  audioEntry,
  shellOutputRoot,
}: {
  series: SeriesDetail;
  part: SeriesPartSummary;
  headings: TocHeading[];
  article: ReactNode;
  previousPart: SeriesPartSummary | null;
  nextPart: SeriesPartSummary | null;
  audioEntry: ReturnType<typeof getSeriesPartAudioEntry>;
  shellOutputRoot?: string;
}) {
  return renderDocument({
    title: `${part.partTitle || part.title} | ${part.seriesTitle}`,
    description: part.description,
    shellOutputRoot,
    children: (
      <SeriesPartContent
        part={part}
        headings={headings}
        parts={series.parts}
        previousPart={previousPart}
        nextPart={nextPart}
        audioEntry={audioEntry}
      >
        {article}
      </SeriesPartContent>
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
  includeCatalogIndex = true,
  includeSeriesIndex = true,
  resetOutputDir = true,
  shellOutputRoot,
}: {
  outputDir: string;
  outputLabel: string;
  writeSummary?: boolean;
  includeCatalogIndex?: boolean;
  includeSeriesIndex?: boolean;
  resetOutputDir?: boolean;
  shellOutputRoot?: string;
}) {
  if (resetOutputDir) {
    await resetOutputDirectory(outputDir);
  } else {
    await fs.mkdir(outputDir, { recursive: true });
  }

  const catalog = getSeriesCatalog();
  const slugs = getAllSeriesSlugs();
  let renderedPartCount = 0;

  if (includeCatalogIndex) {
    await writeTextFile(
      path.join(outputDir, "index.html"),
      await renderCatalogIndex(catalog, shellOutputRoot),
    );
  }

  for (const { seriesSlug } of slugs) {
    const series = getSeriesBySlug(seriesSlug);
    if (!series) {
      continue;
    }

    if (includeSeriesIndex) {
      await writeTextFile(
        path.join(outputDir, seriesSlug, "index.html"),
        await renderSeriesIndex(series, shellOutputRoot),
      );
    }

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

      const audioEntry = getSeriesPartAudioEntry(seriesSlug, part.slug);
      const article = renderCompiledMdx(compiledMdx, staticMdxComponents);
      const html = await renderPartPage({
        series,
        part,
        headings: compiledMdx.headings,
        article,
        previousPart,
        nextPart,
        audioEntry,
        shellOutputRoot,
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
