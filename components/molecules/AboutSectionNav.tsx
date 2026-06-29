import Link from "next/link";

const items = [
  { href: "#overview", label: "Overview" },
  { href: "#career", label: "Career" },
  { href: "#education", label: "Education" },
];

export function AboutSectionNav() {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2 border border-border/50 bg-background/60 p-2 backdrop-blur-sm">
        <span className="px-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Jump To
        </span>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="border border-border/60 bg-card/30 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-foreground/75 transition-colors hover:border-accent hover:text-accent"
          >
            {item.label}
          </a>
        ))}
        <Link
          href="/contacts"
          className="border border-accent-tertiary/35 bg-accent-tertiary/10 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.14em] text-accent-tertiary transition-colors hover:bg-accent-tertiary hover:text-black"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
