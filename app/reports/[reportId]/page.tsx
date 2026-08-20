import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardMain } from "@/components/dashboard-main";
import { ReportDashboard } from "@/components/report-dashboard";
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
import { generateReport } from "@/lib/reports/generate-report";
import { persistGeneratedReport } from "@/lib/reports/persist";
import {
  sampleReportInput,
  sampleReportMeta,
} from "@/lib/reports/sample-case";

export const dynamic = "force-dynamic";

type ReportPageProps = Readonly<{
  params: Promise<{ reportId: string }>;
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

export default async function ReportPage({ params }: ReportPageProps) {
  const { reportId } = await params;

  if (reportId === sampleReportMeta.reportId) {
    const report = generateReport(sampleReportInput);
    return (
      <DashboardMain>
        <ReportDashboard
          watch={sampleReportInput}
          report={report}
          reportId={sampleReportMeta.reportId}
          generatedAt={sampleReportMeta.generatedAt}
          sample
        />
      </DashboardMain>
    );
  }

  const listing = await getWatchCase(reportId);
  if (!listing) {
    notFound();
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
  const report = generateReport(watch, { dossier, factory, seller });
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
    </DashboardMain>
  );
}
