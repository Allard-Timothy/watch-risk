import Link from "next/link";

import { DashboardMain, PageTitle } from "@/components/dashboard-main";

type ExplorerAccessPanelProps = Readonly<{
  reason: string;
}>;

export function ExplorerAccessPanel({ reason }: ExplorerAccessPanelProps) {
  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Explorer access required"
        subtitle={reason}
      />
      <div className="rounded-xl border border-border bg-card p-6 text-[13px] text-muted-foreground">
        <p>
          Knowledge explorers are included with a WatchTell subscription. Sign in
          to manage your account or review pricing.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-foreground px-4 py-2 font-semibold text-background"
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-border px-4 py-2 font-semibold text-foreground"
          >
            View pricing
          </Link>
        </div>
      </div>
    </DashboardMain>
  );
}
