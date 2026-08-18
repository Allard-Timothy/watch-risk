import Link from "next/link";

import { Card, CardTitle, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { compareCommunitySellers } from "@/lib/knowledge/compare";
import { loadCompareCases, loadSellers } from "@/lib/knowledge/load";

export const dynamic = "force-dynamic";

type ComparePageProps = Readonly<{
  searchParams: Promise<{ a?: string; b?: string }>;
}>;

export default async function CompareCommunitiesPage({
  searchParams,
}: ComparePageProps) {
  const params = await searchParams;
  const sellers = await loadSellers();
  const cases = await loadCompareCases();
  const fallback = cases[0];
  const communityAId = params.a ?? fallback?.communityAId ?? "reptime";
  const communityBId = params.b ?? fallback?.communityBId ?? "repwatchforum";
  const result = compareCommunitySellers(sellers, communityAId, communityBId);
  const narrative = cases.find(
    (item) =>
      item.communityAId === communityAId && item.communityBId === communityBId,
  );

  return (
    <DashboardMain>
      <PageTitle
        kicker="Knowledge"
        title="Community comparison"
        subtitle={`${communityAId} vs ${communityBId}. Low overlap can be expected when vetting systems differ.`}
      />

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
          <CardTitle>Only {communityAId}</CardTitle>
          <p className="font-serif text-4xl tracking-tight">
            {result.onlyA.length}
          </p>
        </Card>
        <Card>
          <CardTitle>Only {communityBId}</CardTitle>
          <p className="font-serif text-4xl tracking-tight">
            {result.onlyB.length}
          </p>
        </Card>
      </div>

      {narrative ? (
        <Card className="mb-5">
          <CardTitle>WatchTell interpretation</CardTitle>
          <p className="text-[13px] leading-6 text-muted-foreground">
            {narrative.conclusion}
          </p>
          <ul className="mt-4 space-y-2 text-[13px] leading-6">
            {narrative.vettingDifferences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <NameList title="Both" sellers={result.both} />
        <NameList title={`Only ${communityAId}`} sellers={result.onlyA} />
        <NameList title={`Only ${communityBId}`} sellers={result.onlyB} />
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
