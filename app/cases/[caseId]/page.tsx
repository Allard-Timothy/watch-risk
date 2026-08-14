import type { Metadata } from "next";

import { CaseDetailView } from "@/components/case-detail";
import { DashboardMain } from "@/components/dashboard-main";

export const metadata: Metadata = {
  title: "Case | WatchTell",
  description: "Review listing details, add photos, and open the buyer-risk report.",
};

type CaseDetailPageProps = Readonly<{
  params: Promise<{ caseId: string }>;
}>;

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseId } = await params;

  return (
    <DashboardMain className="max-w-3xl">
      <CaseDetailView caseId={caseId} />
    </DashboardMain>
  );
}
