import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardMain } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { SellerProfile } from "@/components/seller-profile";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import { loadSellers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

type SellerPageProps = Readonly<{
  params: Promise<{ sellerId: string }>;
}>;

export async function generateMetadata({
  params,
}: SellerPageProps): Promise<Metadata> {
  const { sellerId } = await params;
  const sellers = await loadSellers();
  const seller = sellers.find((item) => item.sellerId === sellerId);
  return {
    title: seller
      ? `${seller.canonicalName} | WatchTell`
      : "Seller | WatchTell",
  };
}

export default async function SellerPage({ params }: SellerPageProps) {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

  const { sellerId } = await params;
  const sellers = await loadSellers();
  const seller = sellers.find((item) => item.sellerId === sellerId);
  if (!seller) {
    notFound();
  }

  return (
    <DashboardMain>
      <SellerProfile seller={seller} />
    </DashboardMain>
  );
}
