import type { ReactNode } from "react";
import Link from "next/link";

import { Card, CardTitle } from "@/components/dashboard-main";
import {
  DecisionIcon,
  EvidenceIcon,
  MechanicalIcon,
  SellerIcon,
  VisualQcIcon,
} from "@/components/icons";
import {
  COMMUNITY_RECOGNITION_COPY,
  QUALITATIVE_LABEL_COPY,
  recognitionsByIndependenceGroup,
  type CommunitySeed,
  type ModelDossierSeed,
  type SellerSeed,
} from "@/lib/knowledge";
import { unresolvedSellerCopy } from "@/lib/knowledge/resolve";
import { FACTORY_VARIANCE_ASSESSMENT_COPY } from "@/lib/reports/factory-variance";
import type { GeneratedReport } from "@/lib/reports/generate-report";
import type { ReportInput } from "@/lib/reports/generate-report";
import {
  firstPhotoOfType,
  heroPhotoLayout,
  type ReportPhoto,
} from "@/lib/photos/layout";
import type { ConfidenceLevel, ImageFinding, RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const RISK_PRESENTATION: Record<
  RiskLevel,
  {
    label: string;
    short: string;
    badge: string;
    score: string;
    banner: string;
  }
> = {
  low: {
    label: "Low visible risk",
    short: "Low",
    badge: "border-accent/20 bg-accent/10 text-accent",
    score: "text-accent",
    banner: "border-accent/20 bg-accent/10 text-accent",
  },
  medium: {
    label: "Medium-risk listing",
    short: "Medium",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    score: "text-amber-800",
    banner: "border-amber-200 bg-amber-50 text-amber-900",
  },
  high: {
    label: "High-risk listing",
    short: "High",
    badge: "border-red-200 bg-red-50 text-danger",
    score: "text-danger",
    banner: "border-red-200 bg-red-50 text-red-900",
  },
  cannot_assess: {
    label: "Cannot assess from images",
    short: "Cannot assess",
    badge: "border-border bg-muted text-muted-foreground",
    score: "text-muted-foreground",
    banner: "border-border bg-muted text-foreground",
  },
};

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const SEVERITY_BADGE: Record<ImageFinding["severity"], string> = {
  low: "border-border bg-muted text-muted-foreground",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-red-200 bg-red-50 text-danger",
};

type ReportDashboardProps = Readonly<{
  watch: ReportInput;
  report: GeneratedReport;
  reportId: string;
  generatedAt: string;
  sample?: boolean;
  photos?: readonly ReportPhoto[];
  seller?: SellerSeed;
  typedSellerHandle?: string;
  communities?: readonly CommunitySeed[];
  dossier?: ModelDossierSeed;
}>;

function formatPrice(value: number | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function PhotoWell({
  label,
  present,
  src,
  className,
  allowPlaceholder = false,
}: Readonly<{
  label: string;
  present: boolean;
  src?: string;
  className?: string;
  allowPlaceholder?: boolean;
}>) {
  const showPhoto = Boolean(src);
  const showPlaceholder = !showPhoto && present && allowPlaceholder;
  const filled = showPhoto || showPlaceholder;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        filled
          ? "bg-[#d8d5cf]"
          : "border border-dashed border-border bg-muted",
        className,
      )}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : showPlaceholder ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_42%),linear-gradient(180deg,rgba(32,34,36,0.05),rgba(32,34,36,0.22))]" />
      ) : null}
      <span
        className={cn(
          "absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-medium",
          filled
            ? "bg-black/45 text-white"
            : "bg-card/90 text-muted-foreground",
        )}
      >
        {filled ? label : `${label} missing`}
      </span>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: Readonly<{
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}>) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3 shadow-[0_1px_2px_rgba(16,18,22,0.04)]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-[15px] font-semibold leading-tight text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function DlRow({
  label,
  value,
}: Readonly<{ label: string; value: ReactNode }>) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-[13px]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function ReportDashboard({
  watch,
  report,
  reportId,
  generatedAt,
  sample = false,
  photos = [],
  seller,
  typedSellerHandle,
  communities = [],
  dossier,
}: ReportDashboardProps) {
  const risk = RISK_PRESENTATION[report.overallRisk];
  const providedPhotos = report.photoCompleteness.filter((item) => item.present)
    .length;
  const totalPhotos = report.photoCompleteness.length;
  const price = formatPrice(watch.askingPrice);
  const provided = new Set(watch.providedPhotoTypes);
  const movementPresent = provided.has("movement");
  const subtitle = [watch.brand, watch.model].filter(Boolean).join(" ");
  const hero = heroPhotoLayout(photos);
  const factoryClaim =
    dossier?.factory && dossier.factory !== "unknown"
      ? dossier.factory
      : "Insufficient evidence";
  const fulfillment =
    seller?.trustDimensions.find((item) => item.key === "fulfillment_confidence")
      ?.label ?? "insufficient_evidence";
  const sellerName = seller
    ? seller.canonicalName
    : typedSellerHandle
      ? unresolvedSellerCopy(typedSellerHandle)
      : (watch.sellerPlatform ?? "Unknown seller");
  const recognitionGroups = seller
    ? recognitionsByIndependenceGroup(seller, communities)
    : [];

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-[2.15rem] leading-[1.1] tracking-tight text-foreground sm:text-[2.55rem]">
            Risk Analysis Report
          </h1>
          <p className="mt-1.5 text-[15px] text-muted-foreground">
            {subtitle}
            {watch.reference ? ` • Ref. ${watch.reference}` : null}
            {watch.claimedYear ? ` • Claimed ${watch.claimedYear}` : null}
          </p>
        </div>
        <div className="text-[12px] leading-5 text-muted-foreground sm:pt-3 sm:text-right">
          <p>
            Report ID:{" "}
            <span className="font-medium text-foreground">
              {reportId}
            </span>
          </p>
          <p>{generatedAt}</p>
          {sample ? (
            <p className="mt-1 inline-flex rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Sample data
            </p>
          ) : null}
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <div
          id="visual-qc"
          className="grid h-[18.5rem] scroll-mt-6 grid-cols-[minmax(0,1fr)_8.25rem] gap-3 sm:h-[21rem] sm:grid-cols-[minmax(0,1fr)_9rem]"
        >
          <PhotoWell
            label="Dial"
            present={provided.has("dial") || Boolean(hero.primary)}
            src={hero.primary?.url}
            allowPlaceholder={sample}
            className="h-full"
          />
          <div className="grid h-full grid-rows-2 gap-3">
            <PhotoWell
              label="Bracelet"
              present={provided.has("bracelet") || Boolean(hero.secondary)}
              src={hero.secondary?.url}
              allowPlaceholder={sample}
              className="h-full"
            />
            <PhotoWell
              label="Caseback"
              present={provided.has("caseback") || Boolean(hero.tertiary)}
              src={hero.tertiary?.url}
              allowPlaceholder={sample}
              className="h-full"
            />
          </div>
        </div>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-semibold",
                risk.badge,
              )}
            >
              {risk.label}
            </span>
            <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Overall risk
                </p>
                <p
                  className={cn(
                    "font-serif text-5xl leading-none tracking-tight",
                    risk.score,
                  )}
                >
                  {risk.short}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Confidence
                </p>
                <p className="text-[1.65rem] font-semibold leading-none text-foreground">
                  {CONFIDENCE_LABEL[report.confidence]}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Limited by incomplete photos
                </p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[13px] font-semibold text-foreground">
                Recommendation
              </p>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {report.safeSummary}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          icon={<VisualQcIcon className="h-4 w-4" />}
          label="Visual QC"
          value={`${providedPhotos}/${totalPhotos}`}
          hint="Photo areas"
        />
        <MetricCard
          icon={<MechanicalIcon className="h-4 w-4" />}
          label="Mechanical"
          value={movementPresent ? "Photo present" : "Cannot assess"}
          hint="Movement"
        />
        <MetricCard
          icon={<EvidenceIcon className="h-4 w-4" />}
          label="Evidence"
          value={`${report.missingEvidence.length} gaps`}
        />
        <MetricCard
          icon={<SellerIcon className="h-4 w-4" />}
          label="Seller"
          value={
            report.sellerRiskSignals.length === 0
              ? "No extra signals"
              : `${report.sellerRiskSignals.length} signal${report.sellerRiskSignals.length === 1 ? "" : "s"}`
          }
        />
        <MetricCard
          icon={<EvidenceIcon className="h-4 w-4" />}
          label="Price"
          value={price ?? "Not provided"}
        />
        <MetricCard
          icon={<VisualQcIcon className="h-4 w-4" />}
          label="Photos"
          value={watch.imageQuality ?? "Unknown"}
          hint="Submitted quality"
        />
        <MetricCard
          icon={<DecisionIcon className="h-4 w-4" />}
          label="Reference"
          value={watch.reference ?? "None"}
        />
        <MetricCard
          icon={<MechanicalIcon className="h-4 w-4" />}
          label="Factory claim"
          value={factoryClaim}
          hint="Curated dossier"
        />
        <MetricCard
          icon={<SellerIcon className="h-4 w-4" />}
          label="Fulfillment"
          value={QUALITATIVE_LABEL_COPY[fulfillment]}
          hint="Seller knowledge"
        />
      </div>

      <p className="rounded-lg border border-border bg-card/80 px-4 py-2.5 text-[12px] leading-5 text-muted-foreground">
        This is a photo-based buyer-risk report. It is not an authentication
        certificate and does not confirm the watch is what the seller claims.
        Independent inspection is recommended when purchase risk is material.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card id="mechanical">
          <CardTitle>Reference consistency</CardTitle>
          <p className="text-[13px] leading-6 text-foreground">
            {report.referenceConsistency}
          </p>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Movement cannot be assessed without a movement photo. No
            timegrapher readings were submitted.
          </p>
        </Card>

        <Card id="seller">
          <CardTitle>Seller & listing</CardTitle>
          <dl className="divide-y divide-border">
            <DlRow
              label="Seller"
              value={
                seller ? (
                  <Link
                    href={`/sellers/${seller.sellerId}`}
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    {sellerName}
                  </Link>
                ) : (
                  sellerName
                )
              }
            />
            <DlRow label="Platform" value={watch.sellerPlatform ?? "—"} />
            <DlRow label="Claimed year" value={watch.claimedYear ?? "—"} />
            <DlRow
              label="Full set claimed"
              value={watch.claimsFullSet ? "Yes" : "No"}
            />
            <DlRow
              label="Stock photos only"
              value={watch.stockPhotosOnly ? "Yes" : "No"}
            />
          </dl>
          {recognitionGroups.length > 0 ? (
            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {recognitionGroups.map((group) => (
                <div key={group.independenceGroup}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {group.independenceGroup}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {group.recognitions.map((recognition) => (
                      <li
                        key={`${recognition.communityId}-${recognition.status}`}
                        className="text-[12px] leading-5 text-foreground"
                      >
                        {recognition.displayName}:{" "}
                        {COMMUNITY_RECOGNITION_COPY[recognition.status]}
                        {recognition.statusSince
                          ? ` · as of ${recognition.statusSince}`
                          : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-[12px] leading-5 text-muted-foreground">
                Missing a community status is not a negative by itself. Forum TD
                is evidence with provenance, not a universal trust score.
              </p>
            </div>
          ) : null}
          {report.sellerRiskSignals.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {report.sellerRiskSignals.map((signal) => (
                <li
                  key={signal}
                  className="text-[13px] leading-5 text-foreground"
                >
                  {signal}
                </li>
              ))}
            </ul>
          ) : null}
        </Card>

        <Card>
          <CardTitle>Purchase</CardTitle>
          <dl className="divide-y divide-border">
            <DlRow label="Asking price" value={price ?? "Not provided"} />
            <DlRow label="Shipping" value="Not in this report" />
          </dl>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Price-risk assessment is limited to the asking price on the listing.
            Fees, duties, and escrow are not included.
          </p>
        </Card>

        <Card>
          <CardTitle>Missing evidence</CardTitle>
          {report.missingEvidence.length === 0 ? (
            <p className="text-[13px] leading-6 text-muted-foreground">
              The recommended photo areas were provided.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {report.missingEvidence.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px]">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-border"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {report.factoryVariance ? (
        <Card id="factory-variance">
          <CardTitle>Known factory variance</CardTitle>
          <p className="text-[13px] leading-6 text-foreground">
            Factory {report.factoryVariance.factoryName} is a curated label, not
            a score.
          </p>
          <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
            {report.factoryVariance.disclaimer}
          </p>
          <ul className="mt-4 space-y-3">
            {report.factoryVariance.items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-muted/40 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold">{item.area}</p>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.02em]",
                      item.assessment === "cannot_assess"
                        ? "border-amber-200 bg-amber-50 text-amber-800"
                        : "border-border bg-muted text-muted-foreground",
                    )}
                  >
                    {FACTORY_VARIANCE_ASSESSMENT_COPY[item.assessment]}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-5">{item.lookFor}</p>
                {item.photosCannotShow ? (
                  <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                    Photos cannot show: {item.photosCannotShow}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <Card>
          <CardTitle>Evidence</CardTitle>
          <p className="mb-4 text-[13px] text-muted-foreground">
            {providedPhotos} of {totalPhotos} recommended photo areas provided.
          </p>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {report.photoCompleteness.map((item) => (
              <li key={item.type} className="min-w-0">
                <PhotoWell
                  label={item.label}
                  present={item.present}
                  src={firstPhotoOfType(photos, item.type)?.url}
                  allowPlaceholder={sample}
                  className="aspect-square"
                />
                <p className="mt-1.5 truncate text-center text-[11px] text-muted-foreground">
                  {item.present ? item.label : `${item.label} missing`}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <Card id="decision" className="flex flex-col">
          <CardTitle>Final decision</CardTitle>
          <div
            className={cn(
              "flex flex-1 flex-col items-center justify-center rounded-xl border px-4 py-8 text-center",
              risk.banner,
            )}
          >
            <p className="font-serif text-2xl tracking-tight">{risk.label}</p>
            <p className="mt-2 max-w-sm text-[13px] leading-5">
              {report.recommendedNextStep}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Visible concerns</CardTitle>
          {report.visibleConcerns.length === 0 ? (
            <p className="text-[13px] leading-6 text-muted-foreground">
              No photo-based concerns were flagged by the automated checks.
              This reflects only what the submitted photos can show.
            </p>
          ) : (
            <ul className="space-y-3">
              {report.visibleConcerns.map((concern, index) => (
                <li
                  key={`${concern.area}-${index}`}
                  className="rounded-lg border border-border bg-muted/40 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] font-semibold">{concern.area}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em]",
                        SEVERITY_BADGE[concern.severity],
                      )}
                    >
                      {concern.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-5">
                    {concern.finding}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle>Questions to ask the seller</CardTitle>
          <ol className="space-y-3">
            {report.sellerQuestions.map((question, index) => (
              <li key={question} className="flex gap-3 text-[13px] leading-5">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

