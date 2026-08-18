import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailView } from "@/components/case-detail";
import { DashboardMain } from "@/components/dashboard-main";
import { getWatchCase } from "@/lib/cases/repository";
import { loadModelDossiers, loadSellers } from "@/lib/knowledge/load";
import { matchModelDossier } from "@/lib/knowledge/match-reference";
import { recommendedPhotoAreasFor } from "@/lib/photos";

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

  const [dossiers, sellers] = await Promise.all([
    loadModelDossiers(),
    listing.sellerId ? loadSellers() : Promise.resolve([]),
  ]);
  const dossier = matchModelDossier(
    dossiers,
    listing.brand,
    listing.reference,
  );
  const seller = listing.sellerId
    ? sellers.find((item) => item.sellerId === listing.sellerId)
    : undefined;

  return (
    <DashboardMain className="max-w-3xl">
        <CaseDetailView
          caseId={listing.id}
          initialListing={listing}
          initialPhotos={listing.photos}
          seller={
            seller
              ? { id: seller.sellerId, name: seller.canonicalName }
              : undefined
          }
          recommendedPhotoAreas={recommendedPhotoAreasFor(
            dossier?.requiredPhotos,
          )}
        />
    </DashboardMain>
  );
}
