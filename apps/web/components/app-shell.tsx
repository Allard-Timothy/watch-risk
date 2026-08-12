import type { ReactNode } from "react";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-10">
          <span className="font-serif text-2xl tracking-tight">WatchRisk</span>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Buyer-risk reports
          </span>
        </div>
      </header>
      {children}
    </div>
  );
}
