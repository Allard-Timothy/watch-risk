import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardMain } from "@/components/dashboard-main";
import { OutcomeForm } from "@/components/outcome-form";
import { ReportDashboard } from "@/components/report-dashboard";
import { auth } from "@/lib/auth";
import { canGenerateReport } from "@/lib/billing/access";
import { consumeCredit } from "@/lib/billing/credits";
import { getWatchCase } from "@/lib/cases/repository";
import {
  loadCommunities,
  loadFactories,
  loadModelDossiers,
  loadSellers,
} from "@/lib/knowledge/load";
import { matchFactory } from "@/lib/knowledge/match-factory";
import { matchModelDossier } from "@/lib/knowledge/match-reference";
import { reportInputFromCase } from "@/lib/reports/from-case";
import { getAnalysisProvider } from "@/lib/analysis";
import { persistGeneratedReport } from "@/lib/reports/persist";
import {
  sampleReportInput,
  sampleReportMeta,
} from "@/lib/reports/sample-case";

export const dynamic = "force-dynamic";

type ReportPageProps = Readonly<{
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ outcome?: string }>;
}>;

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { reportId } = await params;
  if (reportId === sampleReportMeta.reportId) {
    return {
      title: "Buyer-risk report | WatchTell",
      description:
        "Placeholder photo-based buyer-risk report built from deterministic rules and sample data.",
    };
  }
  const listing = await getWatchCase(reportId);
  const title = listing
    ? [listing.brand, listing.model].filter(Boolean).join(" ")
    : "Buyer-risk report";
  return {
    title: `${title} | WatchTell`,
    description: "Photo-based buyer-risk report for this listing.",
  };
}

export default async function ReportPage({
  params,
  searchParams,
}: ReportPageProps) {
  const { reportId } = await params;
  const query = await searchParams;

  if (reportId === sampleReportMeta.reportId) {
    const report = getAnalysisProvider().analyze(sampleReportInput);
    const resolved = report instanceof Promise ? await report : report;
    return (
      <DashboardMain>
        <ReportDashboard
          watch={sampleReportInput}
          report={resolved}
          reportId={sampleReportMeta.reportId}
          generatedAt={sampleReportMeta.generatedAt}
          sample
        />
      </DashboardMain>
    );
  }

  const session = await auth();
  const listing = await getWatchCase(reportId);
  if (!listing) {
    notFound();
  }

  const access = await canGenerateReport({
    userId: session?.user?.id,
    caseUserId: listing.userId,
    caseStatus: listing.status,
  });
  if (!access.allowed) {
    return (
      <DashboardMain>
        <div className="rounded-xl border border-border bg-card p-6">
          <h1 className="font-serif text-2xl">Report locked</h1>
          <p className="mt-2 text-[13px] text-muted-foreground">{access.reason}</p>
          <a href="/pricing" className="mt-4 inline-block underline text-[13px]">
            View pricing
          </a>
        </div>
      </DashboardMain>
    );
  }

  if (
    session?.user?.id &&
    process.env.PAYMENTS_MODE !== "mock" &&
    process.env.NODE_ENV === "production" &&
    listing.status === "DRAFT"
  ) {
    const consumed = await consumeCredit(session.user.id);
    if (!consumed) {
      return (
        <DashboardMain>
          <div className="rounded-xl border border-border bg-card p-6">
            <h1 className="font-serif text-2xl">No report credits</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Purchase a report credit before opening this listing report.
            </p>
            <a href="/pricing" className="mt-4 inline-block underline text-[13px]">
              View pricing
            </a>
          </div>
        </DashboardMain>
      );
    }
  }

  const [sellers, dossiers, communities, factories] = await Promise.all([
    loadSellers(),
    loadModelDossiers(),
    loadCommunities(),
    loadFactories(),
  ]);
  const seller = listing.sellerId
    ? sellers.find((item) => item.sellerId === listing.sellerId)
    : undefined;
  const dossier = matchModelDossier(
    dossiers,
    listing.brand,
    listing.reference,
  );
  const factory = dossier
    ? matchFactory(factories, dossier.factory)
    : undefined;
  const watch = reportInputFromCase(listing);
  const reportResult = getAnalysisProvider().analyze(watch, {
    dossier,
    factory,
    seller,
  });
  const report = reportResult instanceof Promise ? await reportResult : reportResult;
  try {
    await persistGeneratedReport(listing.id, report);
  } catch (error) {
    console.error("persistGeneratedReport failed", error);
  }
  const generatedAt = listing.createdAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <DashboardMain>
      {query.outcome === "saved" ? (
        <p className="mb-4 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-[13px] text-accent">
          Outcome saved as provenance-tagged evidence.
        </p>
      ) : null}
      <ReportDashboard
        watch={watch}
        report={report}
        reportId={listing.id}
        generatedAt={generatedAt}
        photos={listing.photos}
        seller={seller}
        typedSellerHandle={listing.typedSellerHandle}
        communities={communities}
        dossier={dossier}
      />
      {session?.user ? <OutcomeForm caseId={listing.id} /> : null}
    </DashboardMain>
  );
}
