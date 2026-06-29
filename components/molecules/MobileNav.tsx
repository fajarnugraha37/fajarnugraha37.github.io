"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  accentClass: string;
  highlight?: boolean;
  children?: { href: string; label: string; accentClass: string }[];
}

const NAV_LINKS: NavLink[] = [
  { href: "/blogs", label: "/Blogs", accentClass: "hover:text-accent" },
  {
    href: "/series",
    label: "/Series",
    accentClass: "hover:text-accent-tertiary",
  },
  {
    href: "/about",
    label: "/About",
    accentClass: "hover:text-accent-secondary",
  },
  {
    href: "/labs",
    label: "/Labs",
    accentClass: "hover:text-accent-tertiary",
    children: [
      {
        href: "/labs/postgresql",
        label: "SQL LAB.EXE",
        accentClass: "hover:text-accent",
      },
      {
        href: "/labs/duckdb",
        label: "OLAP LAB.EXE",
        accentClass: "hover:text-accent-secondary",
      },
      {
        href: "/labs/knowledge-graph",
        label: "BLOG NETWORKS.EXE",
        accentClass: "hover:text-accent-tertiary",
      },
      {
        href: "/labs/markdown",
        label: "MARKDOWN PLAYGROUND.EXE",
        accentClass: "hover:text-accent",
      },
      {
        href: "/labs/ffmpeg",
        label: "MEDIA PROCESSOR.EXE",
        accentClass: "hover:text-accent-secondary",
      },
      {
        href: "/labs/translate",
        label: "TRANSLATION PLAYGROUND.EXE",
        accentClass: "hover:text-accent-tertiary",
      },
    ],
  },
  { href: "/feed.xml", label: "/RSS Feed", accentClass: "hover:text-accent" },
  {
    href: "/contacts",
    label: "Contact.exe",
    accentClass: "hover:text-accent-tertiary",
    highlight: true,
  },
];

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenSearch: () => void;
}

export function MobileNav({ isOpen, setIsOpen, onOpenSearch }: MobileNavProps) {
  const [expandedLabs, setExpandedLabs] = useState(false);
  const pathname = usePathname();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setExpandedLabs(false);
  }, [setIsOpen]);

  const handleSearchOpen = useCallback(() => {
    handleClose();
    onOpenSearch();
  }, [handleClose, onOpenSearch]);

  // Handle navigation updates via effect - close menu when route changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    handleClose();
  }, [pathname, handleClose]);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        id="mobile-nav-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen ? "true" : "false"}
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5 border border-border bg-card/60 cyber-chamfer-sm hover:border-accent transition-colors"
      >
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            isOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 ${
            isOpen ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block w-5 h-px bg-accent transition-all duration-300 origin-center ${
            isOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      <nav
        aria-label="Mobile navigation"
        className={`fixed top-16 right-0 w-full z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="border-b border-border bg-background/95 backdrop-blur-md shadow-2xl max-h-[80vh] overflow-y-auto relative">
          {/* Grid scanline decoration */}
          <div className="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none" />

          <div className="relative border-b border-border/50 p-4">
            <button
              type="button"
              onClick={handleSearchOpen}
              className="flex w-full items-center justify-between border border-border bg-card/40 px-4 py-3 text-left text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <span>Search</span>
              <span className="text-accent/60">⌘K</span>
            </button>
          </div>

          <div className="relative">
            <div className="px-6 pt-4 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
              Explore
            </div>
          </div>
          <ul className="relative flex flex-col divide-y divide-border/50">
            {NAV_LINKS.filter((link) => !link.highlight && link.href !== "/feed.xml").map((link) => (
              <li key={link.href} className="flex flex-col">
                {link.children ? (
                  <>
                    <div className="flex items-center justify-between px-6 py-4">
                      <Link
                        href={link.href}
                        onClick={handleClose}
                        className={`flex items-center gap-3 font-sans text-sm uppercase tracking-widest transition-colors text-foreground/80 hover:text-accent ${pathname.startsWith(link.href) ? "text-accent" : ""}`}
                      >
                        <span className="font-mono text-accent/60 text-xs">
                          &gt;
                        </span>
                        {link.label}
                      </Link>
                      <button
                        onClick={() => setExpandedLabs(!expandedLabs)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-accent transition-colors"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${expandedLabs ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    {expandedLabs && (
                      <ul className="bg-muted/10 divide-y divide-border/30">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={handleClose}
                              className={`flex items-center gap-3 pl-12 pr-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors ${pathname === child.href ? "text-accent" : "text-muted-foreground hover:text-accent"}`}
                            >
                              <span className="opacity-40">#</span>
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    prefetch={link.href.endsWith(".xml") ? false : undefined}
                    onClick={handleClose}
                    className={`flex items-center gap-3 px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors ${
                      link.highlight
                        ? "text-accent border-l-2 border-accent hover:bg-accent/10"
                        : `text-foreground/80 border-l-2 border-transparent hover:border-accent ${link.accentClass}`
                    } ${pathname === link.href ? "text-accent border-l-accent border-l-2" : ""}`}
                  >
                    <span className="font-mono text-accent/60 text-xs">
                      &gt;
                    </span>
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="relative px-6 pt-4 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent-tertiary">
            Utility
          </div>
          <div className="relative flex flex-col divide-y divide-border/50">
            <Link
              href="/feed.xml"
              prefetch={false}
              onClick={handleClose}
              className={`flex items-center gap-3 px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors ${
                pathname === "/feed.xml"
                  ? "text-accent border-l-accent border-l-2"
                  : "text-foreground/80 border-l-2 border-transparent hover:border-accent hover:text-accent"
              }`}
            >
              <span className="font-mono text-accent/60 text-xs">&gt;</span>
              /RSS Feed
            </Link>
            <Link
              href="/contacts"
              onClick={handleClose}
              className={`flex items-center gap-3 px-6 py-4 font-sans text-sm uppercase tracking-widest transition-colors ${
                pathname === "/contacts"
                  ? "text-accent-tertiary border-l-accent-tertiary border-l-2"
                  : "text-foreground/80 border-l-2 border-transparent hover:border-accent-tertiary hover:text-accent-tertiary"
              }`}
            >
              <span className="font-mono text-accent/60 text-xs">&gt;</span>
              Contact.exe
            </Link>
          </div>

          {/* Corner accent */}
          <div className="absolute bottom-0 right-4 w-8 h-px bg-accent/30" />
        </div>
      </nav>
    </div>
  );
}
