import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { SellerList } from "@/components/seller-profile";
import { loadSellers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

export default async function SellersPage() {
  const sellers = await loadSellers();

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Sellers"
        subtitle="Curated community recognition. TD status is evidence, not a universal conclusion."
      />
      <SellerList sellers={sellers} />
    </DashboardMain>
  );
}
