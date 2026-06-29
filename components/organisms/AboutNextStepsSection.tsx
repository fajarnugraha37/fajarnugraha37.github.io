import Link from "next/link";
import { Mail, ScrollText, BookOpenText } from "lucide-react";

const pathways = [
  {
    href: "/contacts",
    label: "Start a Conversation",
    description: "Best path for collaboration, consulting, or technical discussion.",
    icon: Mail,
    accentClass: "hover:border-accent-secondary hover:text-accent-secondary",
  },
  {
    href: "/blogs",
    label: "Read My Writing",
    description: "Open essays, notes, and engineering thinking in more detail.",
    icon: ScrollText,
    accentClass: "hover:border-accent hover:text-accent",
  },
  {
    href: "/series",
    label: "Explore Learning Tracks",
    description: "Structured series for readers.",
    icon: BookOpenText,
    accentClass: "hover:border-accent-tertiary hover:text-accent-tertiary",
  },
];

export function AboutNextStepsSection() {
  return (
    <section id="next-steps" className="scroll-mt-28">
      <div className="border border-border/60 bg-card/25 p-5 backdrop-blur-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent-secondary">
              Next Step
            </p>
            <h2 className="mt-2 text-xl font-semibold text-foreground md:text-2xl">
              Pick the path that matches why you came here.
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {pathways.map((pathway) => {
            const Icon = pathway.icon;

            return (
              <Link
                key={pathway.href}
                href={pathway.href}
                className={`group border border-border/60 bg-background/50 p-4 transition-colors ${pathway.accentClass}`}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em]">
                    Pathway
                  </span>
                </div>
                <p className="mt-3 text-base font-medium text-foreground transition-colors group-hover:text-current">
                  {pathway.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pathway.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
