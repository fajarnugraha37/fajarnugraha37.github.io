"use client";

import React from "react";
import Link from "next/link";
import { Binary, ChevronRight, Cpu, DatabaseZap, FolderInput, ShieldCheck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { PageTransition } from "@/components/atoms/PageTransition";
import { LabNodeCard } from "@/components/molecules/LabNodeCard";
import { PageHeader } from "@/components/molecules/PageHeader";
import {
  LAB_CATEGORIES,
  getFeaturedLabs,
  getLabsByCategory,
} from "@/lib/data/labs";
import { cn } from "@/lib/utils";

const RUNTIME_NOTES = [
  {
    title: "Runs In Browser",
    description: "Most work happens locally on your device instead of a remote backend.",
    icon: ShieldCheck,
  },
  {
    title: "Mind CPU Spikes",
    description: "Analytical, media, and inference labs can feel heavier on older laptops.",
    icon: Cpu,
  },
  {
    title: "Bring Local Input",
    description: "Some modules get better immediately when you already have a file, note, or query goal.",
    icon: FolderInput,
  },
];

const featuredLabs = getFeaturedLabs();
const groupedLabs = LAB_CATEGORIES.map((category) => ({
  category,
  items: getLabsByCategory(category.id),
})).filter((group) => group.items.length > 0);

export function LabsDashboardContent() {
  return (
    <PageTransition>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:gap-10 md:py-12">
        <PageHeader
          title="LABORATORY"
          accentText="DASHBOARD"
          tagText="SYSTEM_CORE // LOCAL_BROWSER_MODULES"
          tagIcon={Binary}
          subtitle="Choose the right sandbox before you spend energy exploring"
        />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-border bg-card/20 p-5 cyber-chamfer md:p-6">
            <div className="space-y-4">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Labs are for hands-on experiments after reading is not enough. Pick the module
                that matches your current input, expected compute cost, and the kind of feedback
                you want to get quickly.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                  {featuredLabs.length} guided modules
                </span>
                <span className="border border-border bg-card/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  {groupedLabs.length} goal-based sections
                </span>
                <span className="border border-border bg-card/40 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                  100% browser-first workflow
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {featuredLabs[0] ? (
                  <Button asChild size="sm">
                    <Link href={featuredLabs[0].path}>Open {featuredLabs[0].name}</Link>
                  </Button>
                ) : null}
                <Button asChild variant="outline" size="sm">
                  <Link href="#labs-by-goal">Browse By Goal</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="border border-border/70 bg-card/10 p-5 md:p-6">
            <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
              Choose Faster
            </span>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  01 // Pick The Input
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Tables and queries point to data labs. Text and notes fit writing or translation
                  workflows. Media files belong in FFmpeg.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  02 // Watch The Compute
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  DuckDB, FFmpeg, and translation can push CPU harder than Markdown or graph
                  browsing on smaller machines.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  03 // Start From Reversible Work
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">
                  If you are exploring, begin with SQL Lab, DuckDB, or Markdown Playground before
                  moving into heavier pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="border border-border bg-card/10 p-5 cyber-chamfer md:p-6">
          <div className="flex items-center gap-3">
            <DatabaseZap className="h-5 w-5 text-accent" />
            <div>
              <span className="block text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
                Runtime Notes
              </span>
              <p className="mt-1 text-sm text-muted-foreground">
                Good defaults for trust, performance expectations, and local-first workflows.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            {RUNTIME_NOTES.map((note) => {
              const Icon = note.icon;

              return (
                <div key={note.title} className="border border-border/70 bg-card/30 p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
                      {note.title}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {note.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="labs-by-goal" className="scroll-mt-28 space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
              Browse By Goal
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground md:text-3xl">
              Choose the intent first, then compare the matching modules
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Grouping by intent makes the page easier to scan than one long undifferentiated list.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {groupedLabs.map(({ category, items }) => (
              <Link
                key={category.id}
                href={`#labs-category-${category.id}`}
                className="border border-border bg-card/40 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-accent hover:text-accent"
              >
                {category.title} ({items.length})
              </Link>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          {groupedLabs.map(({ category, items }) => (
            <section
              key={category.id}
              id={`labs-category-${category.id}`}
              className="scroll-mt-28 space-y-4"
            >
              <div className="border-l border-accent/30 pl-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-accent">
                      {category.subtitle}
                    </span>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                      {category.title}
                    </h3>
                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {category.description}
                    </p>
                  </div>
                  <Link
                    href="#labs-by-goal"
                    className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
                  >
                    Jump To Goals
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className={cn("grid grid-cols-1 gap-4", items.length > 1 ? "lg:grid-cols-2" : "")}>
                {items.map((lab) => (
                  <LabNodeCard key={lab.id} node={lab} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
