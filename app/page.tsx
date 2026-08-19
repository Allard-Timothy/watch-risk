import Link from "next/link";

import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { listWatchCases } from "@/lib/cases/repository";
import { SAMPLE_REPORT_PATH } from "@/lib/reports/sample-case";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let recentCases: Awaited<ReturnType<typeof listWatchCases>> = [];
  try {
    recentCases = await listWatchCases(8);
  } catch {
    recentCases = [];
  }
  const latestCase = recentCases[0];

  return (
    <DashboardMain>
      <PageTitle
        title="Overview"
        subtitle="Photo-based buyer-risk workspace. Forum TD labels are evidence, not a universal conclusion."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Intake
          </p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight">Start a case</h2>
          <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
            Record listing details, then add photos. Listing details and photos
            are saved with the case. Nothing is paid or sent to a model in this
            step.
          </p>
          <Link
            href="/cases/new"
            className="mt-5 inline-flex w-fit items-center rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
          >
            New case
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Evidence
          </p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight">Photos</h2>
          <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
            Label dial, caseback, bracelet, and other areas so missing evidence
            is obvious before you open a report.
          </p>
          <Link
            href={latestCase ? `/cases/${latestCase.id}` : "/cases/draft"}
            className="mt-5 inline-flex w-fit items-center rounded-lg border border-border px-4 py-2 text-[13px] font-semibold"
          >
            {latestCase ? "Open latest case" : "Open draft"}
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Report
          </p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight">
            Sample report
          </h2>
          <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
            Tudor Black Bay 58 layout preview. Uses deterministic photo rules,
            not a live model call.
          </p>
          <Link
            href={SAMPLE_REPORT_PATH}
            className="mt-5 inline-flex w-fit items-center rounded-lg border border-border px-4 py-2 text-[13px] font-semibold"
          >
            Open report
          </Link>
        </Card>

        <Card className="flex flex-col p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Knowledge
          </p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight">Sellers</h2>
          <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
            Curated community recognition. Compare RepTime-associated lists with
            RepWatchForum without treating either as universal truth.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/sellers"
              className="inline-flex w-fit items-center rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
            >
              Seller index
            </Link>
            <Link
              href="/factories"
              className="inline-flex w-fit items-center rounded-lg border border-border px-4 py-2 text-[13px] font-semibold"
            >
              Factories
            </Link>
            <Link
              href="/compare/communities"
              className="inline-flex w-fit items-center rounded-lg border border-border px-4 py-2 text-[13px] font-semibold"
            >
              Compare
            </Link>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Recent cases
        </p>
        {recentCases.length === 0 ? (
          <p className="mt-3 text-[13px] leading-6 text-muted-foreground">
            No saved cases yet. Create a case to persist listing details and
            photos. This list stays empty if Postgres is not running.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {recentCases.map((listing) => {
              const title = [listing.brand, listing.model]
                .filter(Boolean)
                .join(" ");
              const captured = listing.createdAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <li
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold">
                      {title || "Watch case"}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {listing.id} · {captured} · {listing.photos.length} photo
                      {listing.photos.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/cases/${listing.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-[12px] font-semibold"
                    >
                      Case
                    </Link>
                    <Link
                      href={`/reports/${listing.id}`}
                      className="rounded-lg bg-foreground px-3 py-1.5 text-[12px] font-semibold text-background"
                    >
                      Report
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="mt-4 overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid grid-cols-[1fr_6.5rem] gap-3 bg-[#d8d5cf] p-4 sm:p-5">
            <div className="relative min-h-[12rem] overflow-hidden rounded-xl bg-[#c9c4bc]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.4),transparent_42%)]" />
              <span className="absolute bottom-2 left-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Dial
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#c3beb6]">
                <span className="absolute bottom-2 left-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Bracelet
                </span>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-[#bdb8b0]">
                <span className="absolute bottom-2 left-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Caseback
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6">
            <span className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[12px] font-semibold text-amber-800">
              Medium-risk listing
            </span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight">
              Tudor Black Bay 58
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Sample photo set is incomplete. Open the report dashboard for
              missing evidence, seller questions, and the recommended next step.
            </p>
            <Link
              href={SAMPLE_REPORT_PATH}
              className="mt-5 inline-flex w-fit items-center rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
            >
              View risk analysis
            </Link>
          </div>
        </div>
      </Card>
    </DashboardMain>
  );
}
