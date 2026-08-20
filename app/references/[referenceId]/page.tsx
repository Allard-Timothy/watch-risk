import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardMain } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { ReferenceProfile } from "@/components/reference-profile";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import { loadModelDossiers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

type ReferencePageProps = Readonly<{
  params: Promise<{ referenceId: string }>;
}>;

export async function generateMetadata({
  params,
}: ReferencePageProps): Promise<Metadata> {
  const { referenceId } = await params;
  const dossiers = await loadModelDossiers();
  const dossier = dossiers.find((item) => item.id === referenceId);
  return {
    title: dossier
      ? `${dossier.reference} | WatchTell`
      : "Reference | WatchTell",
  };
}

export default async function ReferencePage({ params }: ReferencePageProps) {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

  const { referenceId } = await params;
  const dossiers = await loadModelDossiers();
  const dossier = dossiers.find((item) => item.id === referenceId);
  if (!dossier) {
    notFound();
  }

  return (
    <DashboardMain>
      <ReferenceProfile dossier={dossier} />
    </DashboardMain>
  );
}
