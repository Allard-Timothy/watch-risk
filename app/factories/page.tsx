import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { FactoryList } from "@/components/factory-profile";
import { loadFactories } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

export default async function FactoriesPage() {
  const factories = await loadFactories();

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Factories"
        subtitle="Curated known-variance notes. A factory label is a claim, not a photo conclusion, and these pages do not assign numeric scores."
      />
      <FactoryList factories={factories} />
    </DashboardMain>
  );
}
