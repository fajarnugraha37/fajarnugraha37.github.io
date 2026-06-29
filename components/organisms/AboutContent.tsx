"use client";

import React from "react";
import Link from "next/link";
import { PageTransition } from "@/components/atoms/PageTransition";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Activity } from "lucide-react";
import { SummarySection } from "@/components/organisms/SummarySection";
import { CareerSection } from "@/components/organisms/CareerSection";
import { EducationSection } from "@/components/organisms/EducationSection";
import { AboutSectionNav } from "@/components/molecules/AboutSectionNav";
import { AboutNextStepsSection } from "@/components/organisms/AboutNextStepsSection";
import { CAREER_DATA, EDUCATION_DATA } from "@/lib/data/about";

/**
 * Organism: AboutContent
 * Orchestrates all sections and ambient layers of the About page.
 */
export function AboutContent() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 cyber-grid-bg opacity-20 -z-10 pointer-events-none" />
      <div className="pointer-events-none fixed inset-0 z-50 hidden opacity-10 md:block not-found-scanlines" />
      <div className="pointer-events-none fixed -left-[10%] top-[-10%] h-[34vw] w-[34vw] rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none fixed -right-[10%] bottom-[-10%] h-[34vw] w-[34vw] rounded-full bg-accent-secondary/5 blur-[120px]" />

      <PageTransition>
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-10 md:py-12">
          <PageHeader
            title="FAJAR ABDI"
            accentText="NUGRAHA"
            tagText="SOFTWARE_ENGINEER // DELIVERY_ARCHITECTURE"
            tagIcon={Activity}
            subtitle="Reliable delivery, honest planning, and systems that stay boring in production."
            className="mb-10"
          />

          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="border border-border/60 bg-card/25 p-5 backdrop-blur-sm md:p-6">
              <p className="text-sm leading-relaxed text-foreground/88 md:text-[15px]">
                I work where software delivery, architectural direction, and operational reality collide.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 ">
              <Link
                href="/contacts"
                className="group border border-accent-secondary/40 bg-accent-secondary/10 px-4 py-4 transition-colors hover:bg-accent-secondary hover:text-black"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent-secondary transition-colors group-hover:text-current">
                  Start Here
                </p>
                <p className="mt-2 text-sm font-medium text-foreground transition-colors group-hover:text-current">
                  Contact for collaboration or technical discussions
                </p>
              </Link>
              <Link
                href="/blogs"
                className="group border border-border/60 bg-background/50 px-4 py-4 transition-colors hover:border-accent hover:text-accent"
              >
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent transition-colors group-hover:text-current">
                  Writing
                </p>
                <p className="mt-2 text-sm font-medium text-foreground transition-colors group-hover:text-current">
                  Read how I think through software, systems, and trade-offs
                </p>
              </Link>
            </div>
          </div>

          <AboutSectionNav />

          <div className="mt-10 space-y-20 md:space-y-24">
            <SummarySection />
            <CareerSection jobs={CAREER_DATA} />
            <EducationSection education={EDUCATION_DATA} />
            <AboutNextStepsSection />
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
