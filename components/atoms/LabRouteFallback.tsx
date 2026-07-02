interface LabRouteFallbackProps {
  label: string;
  description: string;
}

export function LabRouteFallback({ label, description }: LabRouteFallbackProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="max-w-xl border border-border/40 bg-card/20 px-6 py-8 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
          {label}
        </div>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
