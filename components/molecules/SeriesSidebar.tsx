import Link from "next/link";
import { SeriesPartGroup } from "@/types";
import { cn } from "@/lib/utils";

interface SeriesSidebarProps {
  seriesSlug: string;
  activePartSlug: string;
  groups: SeriesPartGroup[];
  seriesTitle: string;
  activeGroupId?: string | null;
}

export function SeriesSidebar({
  seriesSlug,
  activePartSlug,
  groups,
  seriesTitle,
  activeGroupId,
}: SeriesSidebarProps) {
  const parts = groups.flatMap((group) => group.parts);
  const activeIndex = parts.findIndex((part) => part.slug === activePartSlug);

  return (
    <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 font-mono text-xs space-y-4">
      <h3 className="text-accent uppercase tracking-widest border-b border-border pb-2">
        [ LEARNING_FLOW ]
      </h3>
      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
        {seriesTitle}
      </p>
      <div className="border border-border/50 bg-card/20 px-3 py-3">
        <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          <span>Progress</span>
          <span className="text-accent">
            {(activeIndex + 1).toString().padStart(2, "0")} / {parts.length.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 h-1 bg-muted overflow-hidden">
          <div
            className="h-full bg-accent"
            style={{ width: `${((activeIndex + 1) / parts.length) * 100}%` }}
          />
        </div>
      </div>

      <nav className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="space-y-2">
            <div
              className={cn(
                "border border-border/40 bg-card/10 px-3 py-2",
                activeGroupId === group.id && "border-accent/40 bg-accent/5",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-foreground">
                  {group.title}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  {group.parts[0].order.toString().padStart(2, "0")}–{group.parts[group.parts.length - 1].order.toString().padStart(2, "0")}
                </span>
              </div>
              {group.subtitle ? (
                <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground normal-case">
                  {group.subtitle}
                </p>
              ) : null}
            </div>

            <div className="space-y-1">
              {group.parts.map((part) => {
                const active = part.slug === activePartSlug;
                return (
                  <Link
                    key={part.slug}
                    href={`/series/${seriesSlug}/${part.slug}`}
                    className={cn(
                      "block border-l pl-3 py-2 transition-colors",
                      active
                        ? "border-accent bg-accent/5 text-accent"
                        : "border-border/50 text-muted-foreground hover:text-accent hover:border-accent/60",
                    )}
                  >
                    <span className="block text-[9px] uppercase tracking-[0.15em] opacity-70">
                      Lesson {part.order.toString().padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug">
                      {part.partTitle || part.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
