"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { ExpandableSummary } from "@/components/molecules/ExpandableSummary";

/**
 * Organism: SummarySection
 * Renders the professional summary section with decorative corner accents.
 */
export function SummarySection() {
  const snapshotItems = [
    {
      label: "Current Focus",
      value: "Backend, architecture, and production stability",
    },
    {
      label: "Operating Bias",
      value: "Honest plans, explicit trade-offs, boring production",
    },
    {
      label: "Scope",
      value: "Cross-functional leadership across services, UI, and stakeholders",
    },
    {
      label: "Best Used For",
      value: "Unblocking delivery, clarifying direction, and reducing operational noise",
    },
  ];

  const scanPoints = [
    "Lead software delivery where roadmap commitments, production reality, and architecture decisions have to agree with each other.",
    "Work across solutioning, incident triage, planning, stakeholder alignment, and engineering guardrails instead of staying inside one lane.",
    "Prefer systems that stay understandable under pressure: clear docs, measurable trade-offs, and delivery plans that survive contact with reality.",
  ];

  return (
    <section id="overview" className="scroll-mt-28">
      <ScrollReveal direction="up">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 bg-accent/10 border border-accent/30 text-accent">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-xs font-bold font-mono text-accent tracking-[0.4em] uppercase">
            OVERVIEW.LOG
          </h2>
          <div className="h-px flex-1 bg-accent/10" />
        </div>

        {/* <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {snapshotItems.map((item) => (
            <div
              key={item.label}
              className="border border-border/50 bg-card/20 p-4 backdrop-blur-sm"
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
                {item.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/88">
                {item.value}
              </p>
            </div>
          ))}
        </div> */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="border border-border/50 bg-background/50 p-5">
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent mb-3">
              In Short
            </p>
            <div className="space-y-3">
              {scanPoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <span className="mt-1 text-accent">&gt;</span>
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ExpandableSummary>
            <div className="space-y-5 py-1 font-mono text-sm leading-relaxed text-foreground/88 md:text-[15px]">
              <p>
                Lead Software Engineer working on a GovTech microservices platform (Singapore). I keep production alive, delivery predictable, and plans honest. Heavily involved in ensuring plans match reality (capacity vs commitment), not just optimism.
              </p>
              <p>
                I&apos;m adaptive and tend to place myself where I can create the most impact. Sometimes that means being the firefighter, jumping into issues, unblocking delivery, and doing the hard triage when things go sideways. But systems that rely on heroes are already broken.
              </p>
              <p>
                I handle solutioning, yearly planning, resource management, speed up development, risk assessment, and research spikes, as well as being the technical point of contact for stakeholders. If there are cost-benefit considerations, I&apos;ll draw it, quantify it, and make it explicit, no hidden complexity, no wishful thinking.
              </p>
              <p>
                Work closely across BA, QA, Infra and PMTs because shipping software is a team sport, not a solo speedrun and “ship it” without “safely” is just shipping problems.
              </p>
              <p>
                I strongly believe in a documentation-based approach and clear engineering guidelines, because heroics don&apos;t scale. I like boring production, docs that don&apos;t lie, honest plans, and systems that don&apos;t require heroic measures to operate.
              </p>
            </div>
          </ExpandableSummary>
        </div>
      </ScrollReveal>
    </section>
  );
}
