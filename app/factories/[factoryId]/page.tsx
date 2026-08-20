import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardMain } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { FactoryProfile } from "@/components/factory-profile";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import { loadFactories } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

type FactoryPageProps = Readonly<{
  params: Promise<{ factoryId: string }>;
}>;

export async function generateMetadata({
  params,
}: FactoryPageProps): Promise<Metadata> {
  const { factoryId } = await params;
  const factories = await loadFactories();
  const factory = factories.find((item) => item.factoryId === factoryId);
  return {
    title: factory
      ? `${factory.canonicalName} | WatchTell`
      : "Factory | WatchTell",
  };
}

export default async function FactoryPage({ params }: FactoryPageProps) {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

  const { factoryId } = await params;
  const factories = await loadFactories();
  const factory = factories.find((item) => item.factoryId === factoryId);
  if (!factory) {
    notFound();
  }

  return (
    <DashboardMain>
      <FactoryProfile factory={factory} />
    </DashboardMain>
  );
}
