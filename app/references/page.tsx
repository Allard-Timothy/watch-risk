import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { ReferenceList } from "@/components/reference-profile";
import { loadModelDossiers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

export default async function ReferencesPage() {
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
