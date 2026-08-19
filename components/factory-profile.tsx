import Link from "next/link";

import { Card, CardTitle } from "@/components/dashboard-main";
import type { FactorySeed } from "@/lib/knowledge";

function photoTypeLabel(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  return value.replaceAll("_", " ");
}

export function FactoryProfile({ factory }: { factory: FactorySeed }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Factory overview
        </p>
        <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight">
          {factory.canonicalName}
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-6 text-muted-foreground">
          {factory.notes ??
            "No curated factory notes yet. A factory label on a listing is a claim, not a conclusion from photos."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Known-variance notes
          </p>
          <p className="mt-1 text-[15px] font-semibold">{factory.defects.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Version snapshots
          </p>
          <p className="mt-1 text-[15px] font-semibold">{factory.versions.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Numeric score
          </p>
          <p className="mt-1 text-[15px] font-semibold">None</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Version notes</CardTitle>
          {factory.versions.length === 0 ? (
            <p className="text-[13px] leading-6 text-muted-foreground">
              No factory version is claimed in the curated notes.
            </p>
          ) : (
            <ul className="divide-y divide-border text-[13px]">
              {factory.versions.map((version) => (
                <li key={version.id} className="py-2">
                  <p className="font-medium">{version.label}</p>
                  {version.notes ? (
                    <p className="mt-1 leading-6 text-muted-foreground">
                      {version.notes}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardTitle>How to read this page</CardTitle>
          <ul className="space-y-2 text-[13px] leading-6 text-muted-foreground">
            <li>
              A factory name on a listing is a claim. These notes do not conclude
              what a submitted photo shows.
            </li>
            <li>
              Known variance is what buyers should ask to see. It is not proof of
              a defect in the photos.
            </li>
            <li>
              Curated notes are a starting snapshot with provenance. They are not
              scraped forum dumps or a universal factory score.
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <CardTitle>Known factory variance</CardTitle>
        {factory.defects.length === 0 ? (
          <p className="text-[13px] leading-6 text-muted-foreground">
            No curated variance notes yet. Missing notes means that area cannot
            be assessed from this seed set.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {factory.defects.map((defect) => (
              <li key={defect.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[15px] font-semibold">{defect.area}</p>
                  {photoTypeLabel(defect.photoType) ? (
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {photoTypeLabel(defect.photoType)} photo
                    </p>
                  ) : null}
                </div>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      What buyers should look for
                    </dt>
                    <dd className="mt-1 text-[13px] leading-6">
                      {defect.whatBuyersShouldLookFor}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      What photos cannot show
                    </dt>
                    <dd className="mt-1 text-[13px] leading-6 text-muted-foreground">
                      {defect.whatPhotosCannotShow}
                    </dd>
                  </div>
                </dl>
                {defect.references.length > 0 ? (
                  <p className="mt-3 text-[12px] text-muted-foreground">
                    Named on{" "}
                    {defect.references.join(", ")}. Independent inspection is
                    still recommended where photos cannot show the area.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function FactoryList({ factories }: { factories: readonly FactorySeed[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {factories.map((factory) => (
        <li key={factory.factoryId}>
          <Link
            href={`/factories/${factory.factoryId}`}
            className="block rounded-xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,18,22,0.04)] transition hover:border-foreground/20"
          >
            <p className="font-serif text-xl tracking-tight">
              {factory.canonicalName}
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {factory.defects.length} known-variance note
              {factory.defects.length === 1 ? "" : "s"}
              {factory.versions[0]?.label
                ? ` · ${factory.versions[0].label}`
                : ""}
            </p>
            <p className="mt-3 text-[12px] leading-5 text-muted-foreground">
              Factory label is a claim. These notes are not proof of a defect in
              photos.
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
