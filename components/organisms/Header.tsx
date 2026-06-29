"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { SearchPalette } from "@/components/molecules/SearchPalette";
import { MobileNav } from "@/components/molecules/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const PRIMARY_NAV_LINKS = [
  {
    href: "/series",
    label: "/Series",
    activeClass: "text-accent-tertiary border-accent-tertiary/70",
  },
  {
    href: "/blogs",
    label: "/Blogs",
    activeClass: "text-accent border-accent/70",
  },
  {
    href: "/labs",
    label: "/Labs",
    activeClass: "text-accent-secondary border-accent-secondary/70",
  },
];

const SECONDARY_NAV_LINKS = [
  {
    href: "/about",
    label: "/About",
    activeClass: "text-accent-secondary",
  },
  {
    href: "/feed.xml",
    label: "/RSS",
    activeClass: "text-accent",
  },
];

const LAB_LINKS = [
  { href: "/labs/postgresql", label: "SQL LAB.EXE", hoverClass: "hover:text-accent" },
  { href: "/labs/duckdb", label: "OLAP LAB.EXE", hoverClass: "hover:text-accent-secondary" },
  { href: "/labs/knowledge-graph", label: "BLOG NETWORKS.EXE", hoverClass: "hover:text-accent-tertiary" },
  { href: "/labs/markdown", label: "MARKDOWN PLAYGROUND.EXE", hoverClass: "hover:text-accent" },
  { href: "/labs/ffmpeg", label: "MEDIA PROCESSOR.EXE", hoverClass: "hover:text-accent-secondary" },
  { href: "/labs/translate", label: "TRANSLATION PLAYGROUND.EXE", hoverClass: "hover:text-accent-tertiary" },
];

export function Header() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // DRY: Use isMobile to auto-close nav when scaling to desktop
  useEffect(() => {
    if (!isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile, isMobileNavOpen]);

  const closeAll = () => {
    setIsSearchOpen(false);
    setIsMobileNavOpen(false);
  };

  const isAnyMenuOpen = isSearchOpen || isMobileNavOpen;
  const isActive = (href: string) =>
    href === "/labs" ? pathname.startsWith("/labs") : pathname === href;

  return (
    <>
      <header className="fixed top-0 w-full z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-sans font-bold text-xl text-accent cyber-glitch-text"
              data-text="SYS//OP"
            >
              SYS//OP
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-5">
              <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.18em]">
                {PRIMARY_NAV_LINKS.map((link) => (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1.5 border-b border-transparent py-1 text-foreground/72 transition-colors hover:text-foreground",
                        isActive(link.href) && link.activeClass
                      )}
                      prefetch={link.href.endsWith(".xml") ? false : undefined}
                    >
                      <span className="font-mono text-[9px] text-accent/55">
                        {isActive(link.href) ? ">" : "/"}
                      </span>
                      {link.label.replace("/", "")}
                      {link.href === "/labs" && (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:rotate-180 group-hover:text-accent-secondary" />
                      )}
                    </Link>

                    {link.href === "/labs" && (
                      <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                        <div className="relative min-w-[280px] border border-border bg-background/95 p-3 shadow-[0_14px_36px_rgba(0,0,0,0.45)] backdrop-blur-md">
                          <div className="absolute inset-0 cyber-grid-bg opacity-10 pointer-events-none" />
                          <div className="relative mb-3 border-b border-border/50 pb-3">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-secondary">
                              Interactive Labs
                            </p>
                            <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-muted-foreground">
                              Hands-on playgrounds for SQL, OLAP, media, and content workflows.
                            </p>
                          </div>
                          <div className="relative space-y-1">
                            {LAB_LINKS.map((lab) => (
                              <Link
                                key={lab.href}
                                href={lab.href}
                                className={cn(
                                  "block border-l-2 border-transparent px-3 py-2 font-mono text-[10px] transition-all hover:bg-accent/10 hover:border-accent",
                                  lab.hoverClass
                                )}
                              >
                                {lab.label}
                              </Link>
                            ))}
                          </div>
                          <Link
                            href="/labs"
                            className="relative mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-accent-secondary"
                          >
                            <span>Open Lab Directory</span>
                            <span className="text-accent-secondary">→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="h-5 w-px bg-border/70" />

              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {SECONDARY_NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={link.href.endsWith(".xml") ? false : undefined}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      isActive(link.href) && link.activeClass
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <SearchPalette isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
            <Link
              href="/contacts"
              className="hidden md:block px-4 py-1 border border-accent text-accent shadow-[0_0_8px_rgba(0,255,136,0.3)] cyber-chamfer-sm hover:bg-accent hover:text-black transition-all text-xs uppercase tracking-widest"
            >
              Contact.exe
            </Link>
            <MobileNav
              isOpen={isMobileNavOpen}
              setIsOpen={setIsMobileNavOpen}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Global Backdrop - Sit ABOVE content but BELOW search/mobile menus */}
      {isAnyMenuOpen && (
        <div 
          className="fixed inset-0 z-[30] bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer"
          onClick={closeAll}
        />
      )}
    </>
  );
}
