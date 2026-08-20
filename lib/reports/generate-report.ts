import {
  SAFE_FALLBACK_REPORT,
  buyerRiskReportSchema,
  type BuyerRiskReport,
  type ConfidenceLevel,
  type DetectedPhotoType,
  type ImageFinding,
  type RiskLevel,
} from "@/lib/validation";
import type {
  FactorySeed,
  ModelDossierSeed,
  SellerSeed,
} from "@/lib/knowledge/schemas";
import { PHOTO_TYPE_LABELS, isDetectedPhotoType } from "@/lib/photos";
import type { ClaimedPhotoType } from "@/lib/photos";
import {
  CANNOT_ASSESS_FROM_IMAGES,
  buildFactoryVariance,
  concernsFromFactoryVariance,
  type FactoryVariance,
} from "@/lib/reports/factory-variance";

/**
 * Deterministic placeholder report generator.
 *
 * This turns case details, image type labels, and curated knowledge into a
 * validated `BuyerRiskReport` by applying the deterministic rules and
 * confidence caps in docs/reference/report-rules.md. It does NOT call a model and does
 * NOT invent visual observations from pixels. `visibleConcerns` come from
 * missing factory-variance photos, missing dossier checkpoints, curated
 * seller product-claim flags, and optional manual notes. Known factory
 * variance is a checklist, not a pixel finding. All language stays within
 * the safe wording allowed by docs/reference/report-rules.md and .cursor/rules/watchrisk.mdc.
 */

export type ImageQuality = "clear" | "mixed" | "poor";

export type ReportInput = Readonly<{
  brand: string;
  model?: string;
  reference?: string;
  claimedYear?: string;
  askingPrice?: number;
  sellerPlatform?: string;
  listingUrl?: string;
  listingText?: string;
  sellerClaims?: string;
  /** Photo areas the buyer actually submitted. */
  providedPhotoTypes: readonly DetectedPhotoType[];
  /** Overall quality of the submitted images. */
  imageQuality?: ImageQuality;
  /** The listing claims a full set (box and papers). */
  claimsFullSet?: boolean;
  /** The listing appears to reuse stock photos. */
  stockPhotosOnly?: boolean;
  /** The seller declined to provide additional photos. */
  sellerRefusedMorePhotos?: boolean;
}>;

export type ReportContext = Readonly<{
  dossier?: ModelDossierSeed;
  factory?: FactorySeed;
  seller?: SellerSeed;
  manualNotes?: readonly string[];
}>;

export type PhotoCompletenessItem = Readonly<{
  type: DetectedPhotoType;
  label: string;
  present: boolean;
}>;

export type GeneratedReport = BuyerRiskReport &
  Readonly<{
    photoCompleteness: readonly PhotoCompletenessItem[];
    referenceConsistency: string;
    sellerRiskSignals: readonly string[];
    factoryVariance?: FactoryVariance;
  }>;

export type { FactoryVariance, FactoryVarianceItem } from "@/lib/reports/factory-variance";

type RecommendedPhoto = Readonly<{
  type: DetectedPhotoType;
  label: string;
  missingEvidence: string;
  sellerQuestion: string;
}>;

const PHOTO_CHECKLIST: Record<DetectedPhotoType, RecommendedPhoto> = {
  dial: {
    type: "dial",
    label: "Dial",
    missingEvidence: "Straight-on dial macro in natural light",
    sellerQuestion: "Can you share a straight-on dial photo in natural light?",
  },
  caseback: {
    type: "caseback",
    label: "Caseback",
    missingEvidence: "Caseback photo",
    sellerQuestion: "Can you photograph the caseback?",
  },
  rehaut: {
    type: "rehaut",
    label: "Rehaut",
    missingEvidence: "Clear rehaut photo",
    sellerQuestion: "Can you photograph the rehaut / inner bezel ring?",
  },
  clasp: {
    type: "clasp",
    label: "Clasp",
    missingEvidence: "Clear clasp and end-link photos",
    sellerQuestion: "Can you photograph the clasp, end links, and bracelet stamps?",
  },
  bracelet: {
    type: "bracelet",
    label: "Bracelet / strap",
    missingEvidence: "Bracelet or strap photo",
    sellerQuestion: "Can you photograph the full bracelet or strap?",
  },
  movement: {
    type: "movement",
    label: "Movement",
    missingEvidence: "Movement photo, or an offer of independent inspection",
    sellerQuestion:
      "Can you provide a movement photo, or allow an independent inspection?",
  },
  papers: {
    type: "papers",
    label: "Papers",
    missingEvidence: "Box and papers photo",
    sellerQuestion: "Can you photograph the box and papers?",
  },
  date_cyclops: {
    type: "date_cyclops",
    label: "Date / cyclops",
    missingEvidence: "Straight-on date window and cyclops photo",
    sellerQuestion:
      "Can you share a straight-on photo of the date window and cyclops?",
  },
  other: {
    type: "other",
    label: "Other",
    missingEvidence: "Additional listing photo",
    sellerQuestion: "Can you share additional photos of the watch?",
  },
};

const DEFAULT_RECOMMENDED_TYPES: readonly DetectedPhotoType[] = [
  "dial",
  "caseback",
  "rehaut",
  "clasp",
  "bracelet",
  "movement",
];

const CONFIDENCE_ORDER: readonly ConfidenceLevel[] = ["low", "medium", "high"];
const RISK_ORDER: readonly RiskLevel[] = ["low", "medium", "high"];

function photoLabel(type: DetectedPhotoType): string {
  if (type in PHOTO_TYPE_LABELS) {
    return PHOTO_TYPE_LABELS[type as ClaimedPhotoType];
  }
  return PHOTO_CHECKLIST[type].label;
}

export function recommendedPhotosFor(
  dossier?: ModelDossierSeed,
): RecommendedPhoto[] {
  if (!dossier) {
    return DEFAULT_RECOMMENDED_TYPES.map((type) => PHOTO_CHECKLIST[type]);
  }
  const fromDossier = dossier.requiredPhotos.flatMap((type) => {
    if (!isDetectedPhotoType(type) || type === "other") {
      return [];
    }
    return [PHOTO_CHECKLIST[type]];
  });
  return fromDossier.length > 0
    ? fromDossier
    : DEFAULT_RECOMMENDED_TYPES.map((type) => PHOTO_CHECKLIST[type]);
}

function collectSellerQuestions(
  input: ReportInput,
  missingPhotos: readonly RecommendedPhoto[],
  context: ReportContext,
): string[] {
  const provided = new Set(input.providedPhotoTypes);
  const questions: string[] = [];
  const seen = new Set<string>();

  const push = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);
    questions.push(trimmed);
  };

  const checks = context.dossier?.highValueChecks ?? [];

  for (const photo of missingPhotos) {
    const matching = checks.filter((check) => check.photoType === photo.type);
    if (matching.length > 0) {
      for (const check of matching) {
        push(check.sellerQuestion);
      }
    } else {
      push(photo.sellerQuestion);
    }
  }

  for (const check of checks) {
    const photoType = check.photoType;
    if (
      !photoType ||
      !isDetectedPhotoType(photoType) ||
      provided.has(photoType)
    ) {
      push(check.sellerQuestion);
    }
  }

  if (input.claimsFullSet && !provided.has("papers")) {
    push("Can you show the box and papers referenced in the listing?");
  }
  if (questions.length === 0) {
    push("Can you confirm the service history and provide any receipts?");
  }
  return questions;
}

function capConfidence(
  current: ConfidenceLevel,
  max: ConfidenceLevel,
): ConfidenceLevel {
  return CONFIDENCE_ORDER.indexOf(current) <= CONFIDENCE_ORDER.indexOf(max)
    ? current
    : max;
}

function increaseRisk(current: RiskLevel): RiskLevel {
  if (current === "cannot_assess") {
    return current;
  }
  const next = Math.min(RISK_ORDER.indexOf(current) + 1, RISK_ORDER.length - 1);
  return RISK_ORDER[next];
}

function listingBlob(input: ReportInput): string {
  return `${input.listingText ?? ""} ${input.sellerClaims ?? ""}`;
}

function assembleCoreReport(
  input: ReportInput,
  recommended: readonly RecommendedPhoto[],
  context: ReportContext,
  factoryVariance?: FactoryVariance,
): BuyerRiskReport {
  const provided = new Set(input.providedPhotoTypes);
  const missingPhotos = recommended.filter((photo) => !provided.has(photo.type));
  const missingCount = missingPhotos.length;

  // Confidence caps (docs/reference/report-rules.md).
  let confidence: ConfidenceLevel = "high";
  if (!provided.has("dial")) {
    confidence = capConfidence(confidence, "medium");
  }
  if (input.imageQuality === "poor" || input.stockPhotosOnly) {
    confidence = capConfidence(confidence, "low");
  } else if (input.imageQuality === "mixed") {
    confidence = capConfidence(confidence, "medium");
  }
  if (missingCount >= 3) {
    confidence = capConfidence(confidence, "low");
  } else if (missingCount >= 1) {
    confidence = capConfidence(confidence, "medium");
  }

  // Overall risk.
  let overallRisk: RiskLevel;
  if (input.stockPhotosOnly) {
    overallRisk = "cannot_assess";
  } else if (missingCount >= 4) {
    overallRisk = "cannot_assess";
  } else if (missingCount >= 1) {
    overallRisk = "medium";
  } else {
    overallRisk = "low";
  }
  if (input.sellerRefusedMorePhotos) {
    overallRisk = increaseRisk(overallRisk);
  }

  // Missing evidence.
  const missingEvidence = missingPhotos.map((photo) => photo.missingEvidence);
  if (input.askingPrice === undefined) {
    missingEvidence.push("Asking price, to assess price risk");
  }

  const sellerQuestions = collectSellerQuestions(
    input,
    missingPhotos,
    context,
  );

  const hasEvidenceGaps = missingCount > 0 || overallRisk === "cannot_assess";

  const recommendedNextStep = hasEvidenceGaps
    ? "Request the missing photos before proceeding. If the seller declines, treat the listing as higher risk and arrange an independent inspection or use escrow."
    : "No photo-based red flags were detected by the automated checks. An independent inspection or escrow is still recommended before purchase.";

  const safeSummary = buildSafeSummary(overallRisk, missingCount);

  const core: BuyerRiskReport = {
    overallRisk,
    confidence,
    missingEvidence,
    visibleConcerns: buildVisibleConcerns(input, context, factoryVariance),
    sellerQuestions,
    recommendedNextStep,
    safeSummary,
  };

  // Validate before returning; fall back to a safe report if anything drifts.
  const parsed = buyerRiskReportSchema.safeParse(core);
  return parsed.success ? parsed.data : SAFE_FALLBACK_REPORT;
}

function buildSafeSummary(risk: RiskLevel, missingCount: number): string {
  if (risk === "cannot_assess") {
    return "The submitted images are not enough to assess this listing. Treat it as a listing that cannot be assessed from photos until more evidence is provided.";
  }
  if (missingCount > 0) {
    return "The submitted photo set is incomplete, so this listing cannot be given a low visible-risk rating yet. Treat it as a medium-risk listing pending more evidence.";
  }
  return "The submitted photos cover the recommended areas and no photo-based red flags were detected. Confidence is still limited to what photos can show.";
}

function buildReferenceConsistency(
  input: ReportInput,
  dossier?: ModelDossierSeed,
): string {
  if (!input.reference) {
    return "No reference was provided, so reference consistency cannot be assessed from the submitted details.";
  }
  if (dossier) {
    const factory =
      dossier.factory && dossier.factory !== "unknown"
        ? ` Curated notes use factory attribution ${dossier.factory}.`
        : " Factory attribution is insufficient from curated notes.";
    return `The claimed reference ${input.reference} matches a curated ${dossier.brand} ${dossier.modelFamily} checklist.${factory} Key details still cannot be confirmed from the submitted photos.`;
  }
  return `The visible case shape and bezel broadly match the claimed reference ${input.reference}, but key details cannot be confirmed from the submitted photos.`;
}

function buildSellerRiskSignals(input: ReportInput): string[] {
  const provided = new Set(input.providedPhotoTypes);
  const signals: string[] = [];
  const blob = listingBlob(input).toLowerCase();
  if (input.stockPhotosOnly) {
    signals.push("Listing appears to reuse stock photos rather than the actual watch.");
  } else if (/stock photos?|catalogue photos?|catalog photos?/.test(blob)) {
    signals.push("Listing text mentions stock or catalogue photos.");
  }
  if (input.sellerRefusedMorePhotos) {
    signals.push("Seller declined to provide additional photos on request.");
  }
  if (input.claimsFullSet && !provided.has("papers")) {
    signals.push("Listing claims a full set, but no box or papers are shown.");
  }
  if (input.providedPhotoTypes.length <= 2) {
    signals.push("Most detail areas rely on a single or very few images.");
  }
  return signals;
}

function qualitativeToSeverity(
  label: SellerSeed["riskFlags"][number]["label"],
): ImageFinding["severity"] | null {
  if (label === "insufficient_evidence") {
    return null;
  }
  if (label === "low") {
    return "low";
  }
  if (label === "high" || label === "very_high") {
    return "high";
  }
  return "medium";
}

function buildVisibleConcerns(
  input: ReportInput,
  context: ReportContext,
  factoryVariance?: FactoryVariance,
): ImageFinding[] {
  const provided = new Set(input.providedPhotoTypes);
  const factoryConcerns = concernsFromFactoryVariance(factoryVariance);
  const coveredPhotoTypes = new Set(
    factoryVariance?.items
      .map((item) => item.photoType)
      .filter((type): type is DetectedPhotoType => Boolean(type)),
  );
  const concerns: ImageFinding[] = [...factoryConcerns];

  if (context.dossier) {
    for (const [area, checkpoints] of Object.entries(
      context.dossier.riskCheckpoints,
    )) {
      if (!isDetectedPhotoType(area) || provided.has(area)) {
        continue;
      }
      if (coveredPhotoTypes.has(area)) {
        continue;
      }
      for (const checkpoint of checkpoints) {
        concerns.push({
          area: photoLabel(area),
          severity: "medium",
          finding: CANNOT_ASSESS_FROM_IMAGES,
          visibleEvidence: `No ${photoLabel(area).toLowerCase()} photo was submitted for this checkpoint (${checkpoint}). This is not a pixel finding.`,
        });
      }
    }
  }

  if (context.seller) {
    for (const flag of context.seller.riskFlags) {
      if (flag.category !== "product_claim") {
        continue;
      }
      const severity = qualitativeToSeverity(flag.label);
      if (!severity) {
        continue;
      }
      concerns.push({
        area: "Seller product claim",
        severity,
        finding: flag.summary,
        visibleEvidence:
          "Curated seller knowledge flag. This is not a pixel analysis of the submitted photos.",
      });
    }
  }

  for (const note of context.manualNotes ?? []) {
    const trimmed = note.trim();
    if (!trimmed) {
      continue;
    }
    concerns.push({
      area: "Buyer note",
      severity: "medium",
      finding: trimmed,
      visibleEvidence:
        "Manual note supplied at intake. This is not a pixel analysis.",
    });
  }

  return concerns;
}

export function generateReport(
  input: ReportInput,
  context: ReportContext = {},
): GeneratedReport {
  const provided = new Set(input.providedPhotoTypes);
  const recommended = recommendedPhotosFor(context.dossier);
  const factoryVariance = buildFactoryVariance(
    input.providedPhotoTypes,
    context.dossier,
    context.factory,
    input.reference,
  );
  const core = assembleCoreReport(
    input,
    recommended,
    context,
    factoryVariance,
  );

  const photoCompleteness: PhotoCompletenessItem[] = recommended.map(
    (photo) => ({
      type: photo.type,
      label: photo.label,
      present: provided.has(photo.type),
    }),
  );

  return {
    ...core,
    photoCompleteness,
    referenceConsistency: buildReferenceConsistency(input, context.dossier),
    sellerRiskSignals: buildSellerRiskSignals(input),
    factoryVariance,
  };
}
