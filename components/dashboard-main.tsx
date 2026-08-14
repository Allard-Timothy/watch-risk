import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardMainProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function DashboardMain({ children, className }: DashboardMainProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8",
        className,
      )}
    >
      {children}
    </main>
  );
}

type PageTitleProps = Readonly<{
  kicker?: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
}>;

export function PageTitle({ kicker, title, subtitle, meta }: PageTitleProps) {
  return (
    <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1.5 text-[15px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {meta ? (
        <div className="shrink-0 text-left text-[12px] leading-5 text-muted-foreground sm:pt-2 sm:text-right">
          {meta}
        </div>
      ) : null}
    </header>
  );
}

export function Card({
  children,
  className,
  id,
}: Readonly<{ children: ReactNode; className?: string; id?: string }>) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-6 rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,18,22,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardTitle({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <h2 className="mb-4 text-[15px] font-semibold tracking-tight text-foreground">
      {children}
    </h2>
  );
}
