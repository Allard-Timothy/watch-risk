import Link from "next/link";

import { Card, CardTitle } from "@/components/dashboard-main";
import type { ModelDossierSeed } from "@/lib/knowledge";

function photoTypeLabel(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return value.replaceAll("_", " ");
}

export function ReferenceProfile({ dossier }: { dossier: ModelDossierSeed }) {
  const factoryLabel = dossier.factory ?? "Unknown";

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Reference overview
        </p>
        <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight">
          {dossier.brand} {dossier.modelFamily}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-muted-foreground">
          {dossier.reference}
        </p>
        <p className="mt-2 max-w-3xl text-[15px] leading-6 text-muted-foreground">
          {dossier.notes ??
            "Curated photo checklist only. Missing a required photo means that area cannot be assessed from submitted images."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Factory claim
          </p>
          <p className="mt-1 text-[15px] font-semibold">{factoryLabel}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Factory version
          </p>
          <p className="mt-1 text-[15px] font-semibold">
            {dossier.factoryVersion ?? "Unspecified"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Required photos
          </p>
          <p className="mt-1 text-[15px] font-semibold">
            {dossier.requiredPhotos.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            High-value checks
          </p>
          <p className="mt-1 text-[15px] font-semibold">
            {dossier.highValueChecks.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Photo checklist</CardTitle>
          <dl className="divide-y divide-border text-[13px]">
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Required</dt>
              <dd className="text-right font-medium">
                {dossier.requiredPhotos.join(", ")}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4 py-2">
              <dt className="text-muted-foreground">Optional</dt>
              <dd className="text-right font-medium">
                {dossier.optionalPhotos.length > 0
                  ? dossier.optionalPhotos.join(", ")
                  : "—"}
              </dd>
            </div>
          </dl>
        </Card>
        <Card>
          <CardTitle>How to read this page</CardTitle>
          <ul className="space-y-2 text-[13px] leading-6 text-muted-foreground">
            <li>
              A factory label on a listing is a claim. These notes do not conclude
              what a submitted photo shows.
            </li>
            <li>
              Known variance is what buyers should ask to see. It is not proof of
              a defect in the photos.
            </li>
            <li>
              High-value checks are seller questions for missing evidence, not a
              numeric QC score.
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardTitle>Known variance</CardTitle>
        {dossier.knownVariance.length === 0 ? (
          <p className="text-[13px] leading-6 text-muted-foreground">
            No curated variance notes yet. Missing notes means that area cannot
            be assessed from this seed set.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {dossier.knownVariance.map((item) => (
              <li
                key={`${item.area}-${item.photoType ?? "none"}`}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[15px] font-semibold">{item.area}</p>
                  {photoTypeLabel(item.photoType) ? (
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {photoTypeLabel(item.photoType)} photo
                    </p>
                  ) : null}
                </div>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      What buyers should look for
                    </dt>
                    <dd className="mt-1 text-[13px] leading-6">
                      {item.whatBuyersShouldLookFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      What photos cannot show
                    </dt>
                    <dd className="mt-1 text-[13px] leading-6 text-muted-foreground">
                      {item.whatPhotosCannotShow}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardTitle>High-value seller questions</CardTitle>
        {dossier.highValueChecks.length === 0 ? (
          <p className="text-[13px] leading-6 text-muted-foreground">
            No curated seller questions yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {dossier.highValueChecks.map((check) => (
              <li key={`${check.area}-${check.sellerQuestion}`}>
                <p className="text-[13px] font-semibold">{check.area}</p>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {check.sellerQuestion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function ReferenceList({
  dossiers,
}: {
  dossiers: readonly ModelDossierSeed[];
}) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {dossiers.map((dossier) => (
        <li key={dossier.id}>
          <Link
            href={`/references/${dossier.id}`}
            className="block rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,18,22,0.04)] transition hover:border-foreground/20"
          >
            <p className="font-serif text-xl tracking-tight">
              {dossier.brand} {dossier.modelFamily}
            </p>
            <p className="mt-1 font-mono text-[13px] text-muted-foreground">
              {dossier.reference}
            </p>
            <p className="mt-3 text-[12px] leading-5 text-muted-foreground">
              Factory claim {dossier.factory ?? "unknown"} ·{" "}
              {dossier.highValueChecks.length} high-value check
              {dossier.highValueChecks.length === 1 ? "" : "s"}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
