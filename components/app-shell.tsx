import type { ReactNode } from "react";
import Link from "next/link";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            WatchTell
          </Link>
          <Link
            href="/cases/new"
            className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Start a case
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
