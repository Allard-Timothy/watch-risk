import Link from "next/link";

import { Card, CardTitle } from "@/components/dashboard-main";
import {
  COMMUNITY_RECOGNITION_COPY,
  QUALITATIVE_LABEL_COPY,
  TRUST_DIMENSION_COPY,
  uniqueIndependenceGroups,
  type SellerSeed,
} from "@/lib/knowledge";
import {
  computeSellerRatings,
  ratingLabelCopy,
} from "@/lib/knowledge/ratings";
import { cn } from "@/lib/utils";

const OVERVIEW_KEYS = [
  "overall",
  "legitimacy_confidence",
  "fulfillment_confidence",
  "communication_quality",
  "qc_process_quality",
  "after_sales_support",
  "longevity",
  "cross_community_validation",
] as const;

export function SellerProfile({ seller }: { seller: SellerSeed }) {
  const dimensions = new Map(
    seller.trustDimensions.map((item) => [item.key, item.label]),
  );
  const computed = computeSellerRatings(seller);
  const overall =
    computed.find((item) => item.key === "overall")?.label ??
    dimensions.get("overall") ??
    "insufficient_evidence";
  const groups = uniqueIndependenceGroups(seller.evidence);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Seller overview
          </p>
          <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight">
            {seller.canonicalName}
          </h1>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
              overall === "high" || overall === "very_high"
                ? "border-accent/20 bg-accent/10 text-accent"
                : overall === "low"
                  ? "border-red-200 bg-red-50 text-danger"
                  : "border-border bg-muted text-muted-foreground",
            )}
          >
            WatchTell confidence: {ratingLabelCopy(overall)}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {computed.find((item) => item.key === "overall")?.basis}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {computed.map((rating) => (
          <div
            key={rating.key}
            className="rounded-xl border border-border bg-card px-3 py-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {rating.key === "overall"
                ? "Overall"
                : rating.key === "qc_communication"
                  ? "QC communication"
                  : "Fulfillment"}
            </p>
            <p className="mt-1 text-[15px] font-semibold">
              {ratingLabelCopy(rating.label)}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
              {rating.basis}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_KEYS.map((key) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-card px-3 py-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {TRUST_DIMENSION_COPY[key]}
            </p>
            <p className="mt-1 text-[15px] font-semibold">
              {QUALITATIVE_LABEL_COPY[dimensions.get(key) ?? "insufficient_evidence"]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Recognized by</CardTitle>
          <ul className="divide-y divide-border text-[13px]">
            {seller.communities.map((record) => (
              <li
                key={record.communityId}
                className="flex items-start justify-between gap-4 py-2"
              >
                <span className="text-muted-foreground">{record.communityId}</span>
                <span className="text-right font-medium">
                  {COMMUNITY_RECOGNITION_COPY[record.status]}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardTitle>Evidence depth</CardTitle>
          <dl className="divide-y divide-border text-[13px]">
            <DepthRow
              label="Independence groups"
              value={String(groups.length)}
            />
            <DepthRow
              label="Transaction reports"
              value={String(seller.evidenceDepth?.transactionReports ?? "—")}
            />
            <DepthRow
              label="Communities represented"
              value={String(
                seller.evidenceDepth?.communitiesRepresented ??
                  new Set(seller.communities.map((item) => item.communityId))
                    .size,
              )}
            />
            <DepthRow
              label="Unresolved disputes known"
              value={String(seller.evidenceDepth?.unresolvedDisputesKnown ?? "—")}
            />
          </dl>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>What we like</CardTitle>
          {seller.likes.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No curated positives yet.
            </p>
          ) : (
            <ul className="space-y-2 text-[13px] leading-6">
              {seller.likes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>Known concerns</CardTitle>
          {seller.concerns.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              No curated concerns in the seed notes.
            </p>
          ) : (
            <ul className="space-y-2 text-[13px] leading-6">
              {seller.concerns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardTitle>WatchTell interpretation</CardTitle>
        <p className="text-[13px] leading-6 text-muted-foreground">
          {seller.interpretation ??
            "Insufficient curated notes for an interpretation."}
        </p>
        <p className="mt-4 text-[12px] text-muted-foreground">
          These notes are starting hypotheses with provenance. Forum TD status
          is evidence, not a universal conclusion.
        </p>
      </Card>

      {seller.riskFlags.length > 0 ? (
        <Card>
          <CardTitle>Risk categories</CardTitle>
          <ul className="space-y-3">
            {seller.riskFlags.map((flag) => (
              <li key={`${flag.category}-${flag.summary}`}>
                <p className="text-[13px] font-semibold capitalize">
                  {flag.category.replaceAll("_", " ")} ·{" "}
                  {QUALITATIVE_LABEL_COPY[flag.label]}
                </p>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {flag.summary}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}

function DepthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function SellerList({ sellers }: { sellers: readonly SellerSeed[] }) {
  if (sellers.length === 0) {
    return (
      <p className="text-[13px] leading-6 text-muted-foreground">
        No curated sellers match these filters.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {sellers.map((seller) => {
        const overall =
          seller.trustDimensions.find((item) => item.key === "overall")
            ?.label ?? "insufficient_evidence";
        return (
          <li key={seller.sellerId}>
            <Link
              href={`/sellers/${seller.sellerId}`}
              className="block rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,18,22,0.04)] transition hover:border-foreground/20"
            >
              <p className="font-serif text-xl tracking-tight">
                {seller.canonicalName}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                WatchTell confidence: {QUALITATIVE_LABEL_COPY[overall]}
              </p>
              <p className="mt-3 text-[12px] text-muted-foreground">
                {seller.communities
                  .slice(0, 3)
                  .map(
                    (record) =>
                      `${record.communityId}: ${COMMUNITY_RECOGNITION_COPY[record.status]}`,
                  )
                  .join(" · ")}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
