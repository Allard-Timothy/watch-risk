import { DashboardMain, PageTitle } from "@/components/dashboard-main";
import { SellerList } from "@/components/seller-profile";
import {
  COMMUNITY_RECOGNITION_COPY,
  COMMUNITY_RECOGNITION_STATUSES,
} from "@/lib/knowledge/enums";
import {
  filterSellers,
  parseRecognitionStatus,
} from "@/lib/knowledge/compare";
import { loadCommunities, loadSellers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

type SellersPageProps = Readonly<{
  searchParams: Promise<{ community?: string; status?: string }>;
}>;

const selectClasses =
  "rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground shadow-sm";

export default async function SellersPage({ searchParams }: SellersPageProps) {
  const params = await searchParams;
  const [sellers, communities] = await Promise.all([
    loadSellers(),
    loadCommunities(),
  ]);
  const communityId = params.community?.trim() || undefined;
  const status = parseRecognitionStatus(params.status);
  const filtered = filterSellers(sellers, { communityId, status });
  const knownCommunity = communities.some((item) => item.id === communityId);

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Sellers"
        subtitle="Curated community recognition. TD status is evidence with provenance, not a trust score."
      />
      <form
        method="get"
        className="mb-5 flex flex-wrap items-end gap-3"
        aria-label="Filter sellers"
      >
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-muted-foreground">
          Community
          <select
            name="community"
            defaultValue={communityId ?? ""}
            className={selectClasses}
          >
            <option value="">All communities</option>
            {communityId && !knownCommunity ? (
              <option value={communityId}>{communityId} (unknown)</option>
            ) : null}
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-muted-foreground">
          Recognition status
          <select
            name="status"
            defaultValue={status ?? ""}
            className={selectClasses}
          >
            <option value="">All statuses</option>
            {COMMUNITY_RECOGNITION_STATUSES.map((item) => (
              <option key={item} value={item}>
                {COMMUNITY_RECOGNITION_COPY[item]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
        >
          Filter
        </button>
      </form>
      <SellerList sellers={filtered} />
    </DashboardMain>
  );
}
