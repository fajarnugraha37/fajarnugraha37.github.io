import Link from "next/link";
import { Mail } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const PRIMARY_ACTIONS = [
  {
    href: "/series",
    label: "Start a Series",
    meta: "Structured learning tracks",
    className: "hover:border-accent-tertiary hover:text-accent-tertiary",
  },
  {
    href: "/blogs",
    label: "Read Latest Writing",
    meta: "Recent essays and notes",
    className: "hover:border-accent hover:text-accent",
  },
  {
    href: "/labs",
    label: "Open a Lab",
    meta: "Interactive playgrounds",
    className: "hover:border-accent-secondary hover:text-accent-secondary",
  },
];

const EXPLORE_LINKS = [
  { href: "/", label: "Home", className: "hover:text-accent" },
  { href: "/series", label: "Series", className: "hover:text-accent-tertiary" },
  { href: "/blogs", label: "Blogs", className: "hover:text-accent" },
  { href: "/about", label: "About", className: "hover:text-accent-secondary" },
];

const LAB_LINKS = [
  { href: "/labs/postgresql", label: "SQL LAB.EXE", className: "hover:text-accent" },
  { href: "/labs/duckdb", label: "OLAP LAB.EXE", className: "hover:text-accent-secondary" },
  { href: "/labs/knowledge-graph", label: "BLOG NETWORKS.EXE", className: "hover:text-accent-tertiary" },
  { href: "/labs/markdown", label: "MARKDOWN PLAYGROUND.EXE", className: "hover:text-accent" },
];

const CONNECT_LINKS = [
  { href: "/contacts", label: "Contact", className: "hover:text-accent-tertiary" },
  { href: "/feed.xml", label: "RSS Feed", className: "hover:text-accent", prefetch: false },
];

export function Footer() {
  return (
    <footer className="relative z-40 mt-auto overflow-hidden border-t border-border/50 bg-background/80 py-10 pb-6 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
      <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-10 px-6">
        <section className="border border-border/60 bg-card/30 p-4 md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
                Next Step
              </p>
              <h2 className="mt-2 text-lg font-semibold text-foreground md:text-xl">
                Choose the path that matches what you want to do next.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Jump into structured learning, fresh writing, or hands-on experiments without digging through the full sitemap.
            </p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {PRIMARY_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group flex items-center justify-between border border-border/70 bg-background/60 px-4 py-3 transition-colors ${action.className}`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground transition-colors group-hover:text-current">
                    {action.label}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {action.meta}
                  </p>
                </div>
                <span className="font-mono text-sm text-muted-foreground transition-colors group-hover:text-current">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1.25fr)_repeat(3,minmax(0,1fr))]">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block font-sans text-2xl font-black tracking-tighter text-foreground cyber-glitch-text"
              data-text="SYS//OP"
            >
              SYS//OP
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Personal archive for long-form learning tracks, software writing, and interactive lab experiments.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_rgba(0,255,136,0.8)]" />
              <span className="text-accent">SYSTEM.ONLINE</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="border-b border-border/50 pb-2 text-sm font-bold uppercase tracking-widest text-foreground">
              Explore
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex w-fit items-center gap-2 text-muted-foreground transition-colors ${link.className}`}
                  >
                    <span className="text-accent/55">&gt;</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="border-b border-border/50 pb-2 text-sm font-bold uppercase tracking-widest text-foreground">
              Lab Picks
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              {LAB_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex w-fit items-center gap-2 text-muted-foreground transition-colors ${link.className}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/labs"
                  className="flex w-fit items-center gap-2 text-muted-foreground transition-colors hover:text-accent-secondary"
                >
                  <span className="text-accent-secondary/70">&gt;</span>
                  Open full lab directory
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="border-b border-border/50 pb-2 text-sm font-bold uppercase tracking-widest text-foreground">
              Connect
            </h3>
            <ul className="space-y-2 text-sm font-mono">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    prefetch={link.prefetch}
                    className={`flex w-fit items-center gap-2 text-muted-foreground transition-colors ${link.className}`}
                  >
                    <span className="text-accent/55">&gt;</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://github.com/fajarnugraha37"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm transition-all hover:border-accent hover:text-accent"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/fajar-abdi-nugraha-81b26618a/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm transition-all hover:border-accent-tertiary hover:text-accent-tertiary"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:nugrahafajar37@gmail.com"
                aria-label="Email"
                className="p-2 border border-border bg-card/50 cyber-chamfer-sm transition-all hover:border-destructive hover:text-destructive"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-border/40 pt-5 text-xs font-mono text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SYS//OP. Built for readable learning and exploration.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Fast paths:</span>
            <Link href="/series" className="transition-colors hover:text-accent-tertiary">
              /series
            </Link>
            <Link href="/blogs" className="transition-colors hover:text-accent">
              /blogs
            </Link>
            <Link href="/contacts" className="transition-colors hover:text-accent-secondary">
              /contacts
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
