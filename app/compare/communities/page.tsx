import Link from "next/link";

import { Card, CardTitle, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { ExplorerAccessPanel } from "@/components/explorer-access-panel";
import { auth } from "@/lib/auth";
import { canAccessExplorers } from "@/lib/billing/access";
import {
  compareCommunitySellers,
  resolveComparePair,
} from "@/lib/knowledge/compare";
import {
  loadCommunities,
  loadCompareCases,
  loadSellers,
} from "@/lib/knowledge/load";
import type { CommunitySeed } from "@/lib/knowledge/schemas";

export const dynamic = "force-dynamic";

type ComparePageProps = Readonly<{
  searchParams: Promise<{ a?: string; b?: string }>;
}>;

const selectClasses =
  "rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground shadow-sm";

function communityLabel(
  communities: readonly CommunitySeed[],
  id: string,
): string {
  return communities.find((item) => item.id === id)?.displayName ?? id;
}

export default async function CompareCommunitiesPage({
  searchParams,
}: ComparePageProps) {
  const session = await auth();
  const explorerAccess = await canAccessExplorers(session?.user?.id);
  if (!explorerAccess.allowed) {
    return <ExplorerAccessPanel reason={explorerAccess.reason} />;
  }

  const params = await searchParams;
  const [sellers, cases, communities] = await Promise.all([
    loadSellers(),
    loadCompareCases(),
    loadCommunities(),
  ]);
  const { communityAId, communityBId } = resolveComparePair(params);
  const result = compareCommunitySellers(sellers, communityAId, communityBId);
  const labelA = communityLabel(communities, communityAId);
  const labelB = communityLabel(communities, communityBId);
  const knownIds = new Set(communities.map((item) => item.id));
  const unknownIds = [communityAId, communityBId].filter(
    (id) => !knownIds.has(id),
  );
  const narrative = cases.find(
    (item) =>
      (item.communityAId === communityAId &&
        item.communityBId === communityBId) ||
      (item.communityAId === communityBId &&
        item.communityBId === communityAId),
  );

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Community comparison"
        subtitle={`${labelA} vs ${labelB}. Overlap uses current recognition lists. Forum TD is evidence with provenance, not a trust score.`}
      />

      <form
        method="get"
        className="mb-5 flex flex-wrap items-end gap-3"
        aria-label="Choose communities to compare"
      >
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-muted-foreground">
          Community A
          <select
            name="a"
            defaultValue={communityAId}
            className={selectClasses}
          >
            {!knownIds.has(communityAId) ? (
              <option value={communityAId}>{communityAId} (unknown)</option>
            ) : null}
            {communities.map((community) => (
              <option key={`a-${community.id}`} value={community.id}>
                {community.displayName}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-muted-foreground">
          Community B
          <select
            name="b"
            defaultValue={communityBId}
            className={selectClasses}
          >
            {!knownIds.has(communityBId) ? (
              <option value={communityBId}>{communityBId} (unknown)</option>
            ) : null}
            {communities.map((community) => (
              <option key={`b-${community.id}`} value={community.id}>
                {community.displayName}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
        >
          Compare
        </button>
      </form>

      {unknownIds.length > 0 ? (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] leading-6 text-amber-900">
          Unknown community id{unknownIds.length === 1 ? "" : "s"}:{" "}
          {unknownIds.join(", ")}. Overlap is still computed from the seed set.
        </p>
      ) : null}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <CardTitle>Overlap</CardTitle>
          <p className="font-serif text-4xl tracking-tight">
            {result.overlapPercent}%
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {result.both.length} sellers in both current lists
          </p>
        </Card>
        <Card>
          <CardTitle>Only {labelA}</CardTitle>
          <p className="font-serif text-4xl tracking-tight">
            {result.onlyA.length}
          </p>
        </Card>
        <Card>
          <CardTitle>Only {labelB}</CardTitle>
          <p className="font-serif text-4xl tracking-tight">
            {result.onlyB.length}
          </p>
        </Card>
      </div>

      <Card className="mb-5">
        <CardTitle>WatchTell interpretation</CardTitle>
        {narrative ? (
          <>
            <p className="text-[13px] leading-6 text-muted-foreground">
              {narrative.conclusion}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] leading-6">
              {narrative.vettingDifferences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-[13px] leading-6 text-muted-foreground">
            No curated interpretation for this pair. Overlap is computed from
            current recognition lists. Forum TD stays evidence with provenance,
            not a trust score.
          </p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <NameList title="Both" sellers={result.both} />
        <NameList title={`Only ${labelA}`} sellers={result.onlyA} />
        <NameList title={`Only ${labelB}`} sellers={result.onlyB} />
      </div>
    </DashboardMain>
  );
}

function NameList({
  title,
  sellers,
}: {
  title: string;
  sellers: { sellerId: string; canonicalName: string }[];
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      {sellers.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">None in the seed set.</p>
      ) : (
        <ul className="space-y-2 text-[13px]">
          {sellers.map((seller) => (
            <li key={seller.sellerId}>
              <Link
                href={`/sellers/${seller.sellerId}`}
                className="font-medium underline-offset-2 hover:underline"
              >
                {seller.canonicalName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
