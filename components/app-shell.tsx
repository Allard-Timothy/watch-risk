"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ExportIcon } from "@/components/icons";
import { Sidebar } from "@/components/sidebar";
import { activeSavedCaseId, reportBasePath } from "@/lib/reports/paths";
import { sampleReportMeta } from "@/lib/reports/sample-case";
import { cn } from "@/lib/utils";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

function crumbsFor(pathname: string): { href?: string; label: string }[] {
  if (pathname.startsWith("/reports/")) {
    const reportId = pathname.split("/")[2] ?? sampleReportMeta.reportId;
    return [
      { href: "/", label: "Reports" },
      { label: reportId },
    ];
  }
  if (pathname === "/cases/new") {
    return [
      { href: "/cases/draft", label: "Cases" },
      { label: "New" },
    ];
  }
  if (pathname.endsWith("/photos")) {
    return [
      { href: "/cases/draft", label: "Cases" },
      { href: "/cases/draft", label: "Draft" },
      { label: "Photos" },
    ];
  }
  if (pathname.startsWith("/cases/")) {
    const caseId = pathname.split("/")[2] ?? "draft";
    return [
      { href: "/", label: "Cases" },
      { label: caseId },
    ];
  }
  return [{ label: "Overview" }];
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname);
  const onReport = pathname.startsWith("/reports");

  return (
    <div className="flex h-dvh overflow-hidden bg-sidebar">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="font-serif text-lg tracking-tight text-foreground lg:hidden"
            >
              WatchTell
            </Link>
            <nav
              aria-label="Breadcrumb"
              className="hidden min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground sm:flex"
            >
              {crumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden="true">›</span> : null}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="truncate text-foreground">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {onReport ? (
              <button
                type="button"
                disabled
                title="PDF export is not wired yet"
                className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] font-medium text-muted-foreground sm:inline-flex"
              >
                <ExportIcon className="h-3.5 w-3.5" />
                Export PDF
              </button>
            ) : null}
            <Link
              href="/cases/new"
              className={cn(
                "inline-flex items-center rounded-lg bg-foreground px-3 py-1.5 text-[13px] font-semibold text-background",
                pathname === "/cases/new" && "opacity-70",
              )}
            >
              Start a case
            </Link>
            <span
              aria-hidden="true"
              className="hidden h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground sm:flex"
            >
              WT
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="lg:hidden">
            <MobileNav pathname={pathname} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const reportHref = reportBasePath(pathname);
  const savedCaseId = activeSavedCaseId(pathname);
  const items = [
    { href: "/", label: "Overview" },
    { href: "/cases/new", label: "New case" },
    { href: savedCaseId ? `/cases/${savedCaseId}` : "/cases/draft", label: "Evidence" },
    { href: reportHref, label: "Report" },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2">
      {items.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
