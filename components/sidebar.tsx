"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CaseIcon,
  DecisionIcon,
  EvidenceIcon,
  MechanicalIcon,
  OverviewIcon,
  SellerIcon,
  VisualQcIcon,
} from "@/components/icons";
import { activeSavedCaseId, reportBasePath } from "@/lib/reports/paths";
import { cn } from "@/lib/utils";

function isActive(
  pathname: string,
  match: "exact" | "cases" | "report" | "sellers" | "factories",
  label: string,
) {
  if (match === "exact") {
    return pathname === "/";
  }
  if (match === "cases") {
    return pathname.startsWith("/cases") && pathname !== "/cases/new";
  }
  if (match === "sellers") {
    return pathname.startsWith("/sellers") || pathname.startsWith("/compare");
  }
  if (match === "factories") {
    return pathname.startsWith("/factories");
  }
  if (match === "report") {
    return label === "Visual QC" && pathname.startsWith("/reports");
  }
  return false;
}

export function Sidebar() {
  const pathname = usePathname();
  const reportBase = reportBasePath(pathname);
  const savedCaseId = activeSavedCaseId(pathname);
  const evidenceHref = savedCaseId ? `/cases/${savedCaseId}` : "/cases/draft";

  const nav = [
    { href: "/", label: "Overview", icon: OverviewIcon, match: "exact" as const },
    {
      href: "/sellers",
      label: "Sellers",
      icon: SellerIcon,
      match: "sellers" as const,
    },
    {
      href: "/factories",
      label: "Factories",
      icon: MechanicalIcon,
      match: "factories" as const,
    },
    {
      href: reportBase,
      label: "Visual QC",
      icon: VisualQcIcon,
      match: "report" as const,
    },
    {
      href: `${reportBase}#mechanical`,
      label: "Mechanical",
      icon: MechanicalIcon,
      match: "report" as const,
    },
    {
      href: `${reportBase}#seller`,
      label: "Seller",
      icon: SellerIcon,
      match: "report" as const,
    },
    {
      href: evidenceHref,
      label: "Evidence",
      icon: EvidenceIcon,
      match: "cases" as const,
    },
    {
      href: `${reportBase}#decision`,
      label: "Decision",
      icon: DecisionIcon,
      match: "report" as const,
    },
  ];

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 pb-4 pt-7">
        <Link href="/" className="font-serif text-[1.65rem] leading-none tracking-tight">
          WatchTell
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.match, item.label);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition",
                active
                  ? "bg-sidebar-hover font-medium text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-hover/70 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}

        <Link
          href="/cases/new"
          className={cn(
            "mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition",
            pathname === "/cases/new"
              ? "bg-sidebar-hover font-medium text-sidebar-foreground"
              : "text-sidebar-muted hover:bg-sidebar-hover/70 hover:text-sidebar-foreground",
          )}
        >
          <CaseIcon className="h-[18px] w-[18px]" />
          New case
        </Link>
        <Link
          href="/pricing"
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-sidebar-muted transition hover:bg-sidebar-hover/70 hover:text-sidebar-foreground"
        >
          Pricing
        </Link>
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="text-[12px] text-sidebar-muted underline hover:text-sidebar-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/account"
            className="text-[12px] text-sidebar-muted underline hover:text-sidebar-foreground"
          >
            Account
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
            WT
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Local preview</p>
            <p className="truncate text-[11px] text-sidebar-muted">Mock billing mode</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
