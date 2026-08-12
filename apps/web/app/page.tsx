const reportHighlights = [
  "Spot missing listing evidence",
  "Organize visible concerns",
  "Prepare practical seller questions",
] as const;

export default function HomePage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
      <section>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Pre-purchase decision support
        </p>
        <h1 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Understand the listing before you send money.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          WatchRisk turns submitted listing details and photos into a structured,
          photo-based buyer-risk report.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background">
            Case workflow coming next
          </span>
          <span className="rounded-md border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
            Independent inspection recommended
          </span>
        </div>
      </section>

      <aside className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Report preview
        </p>
        <h2 className="mt-3 font-serif text-3xl text-foreground">
          Evidence comes first.
        </h2>
        <ul className="mt-7 space-y-4">
          {reportHighlights.map((highlight, index) => (
            <li
              className="flex items-center gap-4 border-t border-border pt-4 text-sm text-foreground"
              key={highlight}
            >
              <span className="font-mono text-xs text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {highlight}
            </li>
          ))}
        </ul>
        <p className="mt-8 rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
          This initial screen is placeholder content. Case intake and report
          generation are intentionally outside this step.
        </p>
      </aside>
    </main>
  );
}
