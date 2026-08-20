"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PhotoUpload, type DraftPhoto } from "@/components/photo-upload";
import { loadDraftCase } from "@/lib/cases/draft-store";
import { unresolvedSellerCopy } from "@/lib/knowledge/resolve";
import { providedDetectedTypes } from "@/lib/photos";
import { sampleReportInput } from "@/lib/reports/sample-case";
import type { CaseCreateInput } from "@/lib/validation";
import type { DetectedPhotoType } from "@/lib/validation";

const SAMPLE_CASE: CaseCreateInput = {
  brand: sampleReportInput.brand,
  model: sampleReportInput.model,
  reference: sampleReportInput.reference,
  claimedYear: sampleReportInput.claimedYear,
  askingPrice: sampleReportInput.askingPrice,
  sellerPlatform: sampleReportInput.sellerPlatform,
  listingText: undefined,
  sellerClaims: undefined,
};

function formatPrice(value: number | undefined): string {
  if (value === undefined) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const LISTING_ROWS: ReadonlyArray<{
  key: keyof CaseCreateInput;
  label: string;
}> = [
  { key: "brand", label: "Brand" },
  { key: "model", label: "Model" },
  { key: "reference", label: "Reference" },
  { key: "claimedYear", label: "Claimed year" },
  { key: "askingPrice", label: "Asking price" },
  { key: "sellerPlatform", label: "Seller platform" },
  { key: "listingUrl", label: "Listing URL" },
  { key: "listingText", label: "Listing text" },
  { key: "sellerClaims", label: "Seller claims" },
];

type CaseSource = "database" | "draft" | "sample";

type CaseDetailViewProps = Readonly<{
  caseId: string;
  initialListing?: CaseCreateInput | null;
  initialPhotos?: readonly DraftPhoto[];
  seller?: { id: string; name: string };
  typedSellerHandle?: string;
  recommendedPhotoAreas?: readonly {
    type: DetectedPhotoType;
    label: string;
  }[];
}>;

export function CaseDetailView({
  caseId,
  initialListing,
  initialPhotos = [],
  seller,
  typedSellerHandle,
  recommendedPhotoAreas,
}: CaseDetailViewProps) {
  const [listing, setListing] = useState<CaseCreateInput>(
    initialListing ?? SAMPLE_CASE,
  );
  const [source, setSource] = useState<CaseSource>(
    initialListing ? "database" : "sample",
  );
  const [providedTypes, setProvidedTypes] = useState<DetectedPhotoType[]>(() =>
    providedDetectedTypes(initialPhotos.map((photo) => photo.claimedType)),
  );

  useEffect(() => {
    if (initialListing) {
      setListing(initialListing);
      setSource("database");
      return;
    }
    if (caseId === "draft") {
      const draft = loadDraftCase();
      if (draft) {
        setListing(draft);
        setSource("draft");
        return;
      }
    }
    setListing(SAMPLE_CASE);
    setSource("sample");
  }, [caseId, initialListing]);

  const title = [listing.brand, listing.model].filter(Boolean).join(" ");

  const sourceCopy: Record<CaseSource, string> = {
    database:
      "Listing details and photos are saved with this case. Open the report to see them in the gallery.",
    draft:
      "Listing details from this browser session. Photos stay in this browser until you save a case.",
    sample:
      "Sample listing for layout review. Save a case to replace this with your intake.",
  };

  const recommendedCount = recommendedPhotoAreas?.length;
  const labeledRequired = recommendedPhotoAreas
    ? providedTypes.filter((type) =>
        recommendedPhotoAreas.some((area) => area.type === type),
      ).length
    : providedTypes.length;
  const missingRequired =
    recommendedPhotoAreas?.filter(
      (area) => !providedTypes.includes(area.type),
    ) ?? [];

  return (
    <div className="space-y-8">
      <header>
        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Case {caseId}
        </p>
        <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem]">
          {title || "Watch case"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{sourceCopy[source]}</p>
      </header>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <h2 className="mb-4 font-serif text-xl tracking-tight">Listing details</h2>
        <dl className="divide-y divide-border">
          {LISTING_ROWS.map((row) => {
            const value = listing[row.key];
            if (value === undefined || value === "") {
              return null;
            }
            return (
              <div
                key={row.key}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="whitespace-pre-wrap break-words text-sm">
                  {row.key === "askingPrice"
                    ? formatPrice(listing.askingPrice)
                    : String(value)}
                </dd>
              </div>
            );
          })}
          {seller ? (
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                Seller
              </dt>
              <dd className="text-sm">
                <Link
                  href={`/sellers/${seller.id}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {seller.name}
                </Link>
              </dd>
            </div>
          ) : typedSellerHandle ? (
            <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                Seller
              </dt>
              <dd className="text-sm">
                {unresolvedSellerCopy(typedSellerHandle)}
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-4">
          <Link
            href="/cases/new"
            className="text-sm font-medium text-foreground underline-offset-2 hover:underline"
          >
            Start another case
          </Link>
        </p>
      </section>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
        <h2 className="mb-4 font-serif text-xl tracking-tight">Photos</h2>
        <PhotoUpload
          caseId={caseId}
          persist={source === "database"}
          initialPhotos={initialPhotos}
          recommendedAreas={recommendedPhotoAreas}
          onProvidedTypesChange={setProvidedTypes}
        />
      </section>

      <section className="rounded-xl border border-accent/30 bg-accent/10 p-5 sm:p-6">
        <h2 className="mb-2 font-serif text-xl tracking-tight">Next step</h2>
        <p className="mb-4 text-sm leading-6 text-muted-foreground">
          {source === "database"
            ? labeledRequired === 0
              ? "Open the photo-based buyer-risk report for this saved case. Label photos to improve completeness; analysis still uses deterministic rules, not a model."
              : `${labeledRequired}${recommendedCount ? ` of ${recommendedCount}` : ""} recommended photo area(s) labeled. The report for this case uses those labels and the saved listing details.`
            : providedTypes.length === 0
              ? "Label at least one recommended photo area, then open the sample report. Analysis is still sample-driven and does not call a model."
              : `${providedTypes.length} recommended photo area(s) labeled. The sample report still uses sample evidence rules; payment and model calls are not wired.`}
        </p>
        {source === "database" && missingRequired.length > 0 ? (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-900">
            Missing recommended photos:{" "}
            {missingRequired.map((area) => area.label).join(", ")}. You can
            still open the report; confidence will stay limited.
          </p>
        ) : null}
        <Link
          href={source === "database" ? `/reports/${caseId}` : "/reports/WR-2026-0481"}
          className="inline-flex items-center justify-center rounded-lg bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm"
        >
          {source === "database" ? "View report" : "View sample report"}
        </Link>
      </section>
    </div>
  );
}
