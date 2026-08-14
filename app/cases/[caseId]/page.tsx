import type { Metadata } from "next";

import { CaseDetailView } from "@/components/case-detail";

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
    <main className="mx-auto w-full max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <CaseDetailView caseId={caseId} />
    </main>
  );
}
