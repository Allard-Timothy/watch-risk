import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/case-detail";
import { DashboardMain } from "@/components/dashboard-main";
import { getWatchCase } from "@/lib/cases/repository";

export const metadata: Metadata = {
  title: "Case | WatchTell",
  description: "Review listing details, add photos, and open the buyer-risk report.",
};

export const dynamic = "force-dynamic";

type CaseDetailPageProps = Readonly<{
  params: Promise<{ caseId: string }>;
}>;

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseId } = await params;

  if (caseId === "draft") {
    return (
      <DashboardMain className="max-w-3xl">
        <CaseDetailView caseId="draft" />
      </DashboardMain>
    );
  }

  const listing = await getWatchCase(caseId);
  if (!listing) {
    notFound();
  }

  return (
    <DashboardMain className="max-w-3xl">
      <CaseDetailView caseId={listing.id} initialListing={listing} />
    </DashboardMain>
  );
}
