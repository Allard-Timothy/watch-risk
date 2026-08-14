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
import { SAMPLE_REPORT_PATH } from "@/lib/reports/sample-case";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Overview", icon: OverviewIcon, match: "exact" },
  {
    href: SAMPLE_REPORT_PATH,
    label: "Visual QC",
    icon: VisualQcIcon,
    match: "report",
  },
  {
    href: `${SAMPLE_REPORT_PATH}#mechanical`,
    label: "Mechanical",
    icon: MechanicalIcon,
    match: "report",
  },
  {
    href: `${SAMPLE_REPORT_PATH}#seller`,
    label: "Seller",
    icon: SellerIcon,
    match: "report",
  },
  {
    href: "/cases/draft",
    label: "Evidence",
    icon: EvidenceIcon,
    match: "cases",
  },
  {
    href: `${SAMPLE_REPORT_PATH}#decision`,
    label: "Decision",
    icon: DecisionIcon,
    match: "report",
  },
] as const;

function isActive(
  pathname: string,
  match: (typeof NAV)[number]["match"],
  label: string,
) {
  if (match === "exact") {
    return pathname === "/";
  }
  if (match === "cases") {
    return pathname.startsWith("/cases") && pathname !== "/cases/new";
  }
  if (match === "report") {
    return label === "Visual QC" && pathname.startsWith("/reports");
  }
  return false;
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 pb-4 pt-7">
        <Link href="/" className="font-serif text-[1.65rem] leading-none tracking-tight">
          WatchTell
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {NAV.map((item) => {
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
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
            WT
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Local preview</p>
            <p className="truncate text-[11px] text-sidebar-muted">Sample session</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
