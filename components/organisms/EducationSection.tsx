"use client";

import React from "react";
import { Binary } from "lucide-react";
import { ScrollReveal } from "@/components/atoms/ScrollReveal";
import { EducationCard } from "@/components/molecules/EducationCard";
import { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

/**
 * Organism: EducationSection
 * Renders the grid of academic and certification records.
 */
export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="scroll-mt-28">
      <ScrollReveal direction="up">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-2 bg-accent-tertiary/10 border border-accent-tertiary/30 text-accent-tertiary">
            <Binary className="w-5 h-5" />
          </div>
          <h2 className="text-xs font-bold font-mono text-accent-tertiary tracking-[0.4em] uppercase">
            ACADEMIC_RECORD.ARCHIVE
          </h2>
          <div className="h-px flex-1 bg-accent-tertiary/10" />
        </div>

        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
          Formal education and credentials matter here as supporting context. The main story is still how that foundation translates into delivery, systems thinking, and execution under real constraints.
        </p>

        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {education.map((edu, i) => (
            <EducationCard key={`${edu.school}-${i}`} edu={edu} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
