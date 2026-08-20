import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { FactoryList } from "@/components/factory-profile";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import { loadFactories } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

export default async function FactoriesPage() {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

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
