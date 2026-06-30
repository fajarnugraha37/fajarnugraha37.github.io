"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { LabNodeCard } from "@/components/molecules/LabNodeCard";
import { getFeaturedLabs, getHomepageLabs } from "@/lib/data/labs";

const featuredLabs = getFeaturedLabs();
const secondaryLabs = getHomepageLabs().filter(
  (lab) => !featuredLabs.some((featuredLab) => featuredLab.id === lab.id),
);

export function HardwareNodesSection() {
  return (
    <section className="relative overflow-hidden border-t border-border py-14 md:py-20">
      <ScrollReveal direction="up">
        <div className="mb-5 flex items-center justify-between px-4 md:mb-8">
          <h2 className="mx-auto flex items-center gap-4 text-center font-sans text-3xl font-bold text-foreground md:mx-0 md:text-4xl">
            <span className="text-accent drop-shadow-[0_0_5px_#ff7300]">03 //</span>
            INTERACTIVE LABS
          </h2>
          <Link
            href="/labs"
            className="hidden items-center gap-2 text-xs font-mono text-muted-foreground transition-colors hover:text-accent md:flex"
          >
            [VIEW_ALL_MODULES] <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05} direction="up">
        <div className="mb-8 max-w-3xl px-4 md:mb-10">
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Open a sandbox when you want proof, not just prose. Start with the clearest entry
            points below, then branch into heavier or more specialized modules.
          </p>
        </div>
      </ScrollReveal>

      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal delay={0.08} direction="up">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
                Start Here
              </span>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Best first modules for structured querying, analytical exploration, and low-friction
                writing loops.
              </p>
            </div>
            <Link
              href="/labs#labs-by-goal"
              className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
            >
              Browse By Goal
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {featuredLabs.map((lab, index) => (
            <ScrollReveal key={lab.id} delay={0.1 + index * 0.08} direction="up">
              <LabNodeCard node={lab} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.35} direction="up">
          <div className="mt-8 border-t border-border/70 pt-6">
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
                  More Playgrounds
                </span>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Specialized labs for blog discovery, media conversion, and offline translation.
                </p>
              </div>
              <Link
                href="/labs#labs-by-goal"
                className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
              >
                Browse By Goal
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {secondaryLabs.map((lab, index) => (
                <ScrollReveal key={lab.id} delay={0.4 + index * 0.08} direction="up">
                  <LabNodeCard node={lab} variant="compact" />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-12 flex justify-center md:hidden">
        <Link
          href="/labs"
          className="flex items-center gap-2 text-xs font-mono text-accent transition-colors hover:text-white"
        >
          [VIEW_ALL_MODULES] <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
