import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { ConfidenceLevel, ImageFinding, RiskLevel } from "@/lib/types";
import { mockReport } from "@/lib/reports/mock-report";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Buyer-risk report | WatchRisk",
  description:
    "Placeholder photo-based buyer-risk report built from sample data.",
};

const RISK_PRESENTATION: Record<
  RiskLevel,
  { label: string; badge: string; accentBar: string }
> = {
  low: {
    label: "Low visible risk",
    badge: "border-accent/30 bg-accent/10 text-accent",
    accentBar: "bg-accent",
  },
  medium: {
    label: "Medium-risk listing",
    badge: "border-amber-300 bg-amber-50 text-amber-800",
    accentBar: "bg-amber-500",
  },
  high: {
    label: "High-risk listing",
    badge: "border-red-300 bg-red-50 text-red-800",
    accentBar: "bg-red-600",
  },
  cannot_assess: {
    label: "Cannot assess from images",
    badge: "border-border bg-muted text-muted-foreground",
    accentBar: "bg-muted-foreground",
  },
};

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

const SEVERITY_BADGE: Record<ImageFinding["severity"], string> = {
  low: "border-border bg-muted text-muted-foreground",
  medium: "border-amber-300 bg-amber-50 text-amber-800",
  high: "border-red-300 bg-red-50 text-red-800",
};

function ReportSection({
  title,
  children,
}: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="mb-4 font-serif text-xl tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ReportPage() {
  const report = mockReport;
  const risk = RISK_PRESENTATION[report.overallRisk];
  const providedPhotos = report.photoCompleteness.filter(
    (item) => item.present,
  ).length;
  const totalPhotos = report.photoCompleteness.length;
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(report.watch.askingPrice);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Buyer-risk report
          </p>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
            Sample data
          </span>
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          {report.watch.brand} {report.watch.model}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ref. {report.watch.reference} &middot; Claimed {report.watch.claimedYear}{" "}
          &middot; {price} &middot; {report.watch.sellerPlatform}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          Report {report.reportId} &middot; {report.generatedAt}
        </p>
      </header>

      {/* Overall assessment */}
      <section className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <span
          aria-hidden="true"
          className={cn("absolute inset-y-0 left-0 w-1", risk.accentBar)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Overall risk
            </p>
            <span
              className={cn(
                "mt-2 inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
                risk.badge,
              )}
            >
              {risk.label}
            </span>
          </div>
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Confidence
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {CONFIDENCE_LABEL[report.confidence]}
            </p>
            <p className="text-xs text-muted-foreground">
              Limited by incomplete photos.
            </p>
          </div>
        </div>
        <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-foreground">
          {report.safeSummary}
        </p>
      </section>

      {/* Disclaimer: visible but not dominant */}
      <p className="mt-4 rounded-lg border border-border bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
        This is a photo-based buyer-risk report. It is not an authentication
        certificate and does not confirm the watch is what the seller claims. Use
        an independent watchmaker, escrow, or a brand service center when purchase
        risk is material.
      </p>

      <div className="mt-6 space-y-6">
        <ReportSection title="Evidence quality">
          <p className="mb-4 text-sm text-muted-foreground">
            {providedPhotos} of {totalPhotos} recommended photo areas provided.
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {report.photoCompleteness.map((item) => (
              <li
                key={item.type}
                className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <span className="text-foreground">{item.label}</span>
                {item.present ? (
                  <span className="inline-flex items-center gap-1 font-medium text-accent">
                    <span aria-hidden="true">&#10003;</span> Provided
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <span aria-hidden="true">&#9679;</span> Missing
                  </span>
                )}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Missing evidence">
          <ul className="space-y-2">
            {report.missingEvidence.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-foreground">
                <span aria-hidden="true" className="mt-1 text-amber-600">
                  &#9679;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Visible concerns">
          <ul className="space-y-4">
            {report.visibleConcerns.map((concern) => (
              <li
                key={concern.area}
                className="rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    {concern.area}
                  </p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em]",
                      SEVERITY_BADGE[concern.severity],
                    )}
                  >
                    {concern.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  {concern.finding}
                </p>
                <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex gap-2">
                    <dt className="font-mono uppercase tracking-[0.12em]">
                      Evidence
                    </dt>
                    <dd>{concern.visibleEvidence}</dd>
                  </div>
                  {concern.uncertainty ? (
                    <div className="flex gap-2">
                      <dt className="font-mono uppercase tracking-[0.12em]">
                        Uncertainty
                      </dt>
                      <dd>{concern.uncertainty}</dd>
                    </div>
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Reference consistency">
          <p className="text-sm leading-6 text-foreground">
            {report.referenceConsistency}
          </p>
        </ReportSection>

        <ReportSection title="Seller-risk signals">
          <ul className="space-y-2">
            {report.sellerRiskSignals.map((signal) => (
              <li key={signal} className="flex gap-3 text-sm text-foreground">
                <span aria-hidden="true" className="mt-1 text-muted-foreground">
                  &#8250;
                </span>
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Questions to ask the seller">
          <ol className="space-y-3">
            {report.sellerQuestions.map((question, index) => (
              <li key={question} className="flex gap-3 text-sm text-foreground">
                <span className="font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </ReportSection>

        <section className="rounded-xl border border-accent/30 bg-accent/10 p-5 shadow-sm sm:p-6">
          <h2 className="mb-2 font-serif text-xl tracking-tight text-foreground">
            Recommended next step
          </h2>
          <p className="text-sm leading-6 text-foreground">
            {report.recommendedNextStep}
          </p>
        </section>
      </div>
    </main>
  );
}
