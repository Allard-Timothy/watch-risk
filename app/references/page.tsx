import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { ReferenceList } from "@/components/reference-profile";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import { loadModelDossiers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

  const dossiers = await loadModelDossiers();

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="References"
        subtitle="Curated photo checklists and known-variance notes. A factory label is a claim, not a photo conclusion, and these pages do not assign numeric QC scores."
      />
      <ReferenceList dossiers={dossiers} />
    </DashboardMain>
  );
}
