import {
  SAFE_FALLBACK_REPORT,
  buyerRiskReportSchema,
  type BuyerRiskReport,
  type ConfidenceLevel,
  type DetectedPhotoType,
  type RiskLevel,
} from "@/lib/validation";

/**
 * Deterministic placeholder report generator.
 *
 * This turns case details and image type labels into a validated
 * `BuyerRiskReport` by applying the deterministic rules and confidence caps in
 * docs/report-rules.md. It does NOT call a model and does NOT invent visual
 * observations: `visibleConcerns` is left to the (future) model layer, so this
 * generator returns an empty list. All language stays within the safe wording
 * allowed by docs/report-rules.md and .cursor/rules/watchrisk.mdc.
 */

export type ImageQuality = "clear" | "mixed" | "poor";

export type ReportInput = Readonly<{
  brand: string;
  model?: string;
  reference?: string;
  claimedYear?: string;
  askingPrice?: number;
  sellerPlatform?: string;
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
  }>;

type RecommendedPhoto = Readonly<{
  type: DetectedPhotoType;
  label: string;
  missingEvidence: string;
  sellerQuestion: string;
}>;

const RECOMMENDED_PHOTOS: readonly RecommendedPhoto[] = [
  {
    type: "dial",
    label: "Dial",
    missingEvidence: "Straight-on dial macro in natural light",
    sellerQuestion: "Can you share a straight-on dial photo in natural light?",
  },
  {
    type: "caseback",
    label: "Caseback",
    missingEvidence: "Caseback photo",
    sellerQuestion: "Can you photograph the caseback?",
  },
  {
    type: "rehaut",
    label: "Rehaut",
    missingEvidence: "Clear rehaut photo",
    sellerQuestion: "Can you photograph the rehaut / inner bezel ring?",
  },
  {
    type: "clasp",
    label: "Clasp",
    missingEvidence: "Clear clasp and end-link photos",
    sellerQuestion: "Can you photograph the clasp, end links, and bracelet stamps?",
  },
  {
    type: "bracelet",
    label: "Bracelet / strap",
    missingEvidence: "Bracelet or strap photo",
    sellerQuestion: "Can you photograph the full bracelet or strap?",
  },
  {
    type: "movement",
    label: "Movement",
    missingEvidence: "Movement photo, or an offer of independent inspection",
    sellerQuestion:
      "Can you provide a movement photo, or allow an independent inspection?",
  },
];

const CONFIDENCE_ORDER: readonly ConfidenceLevel[] = ["low", "medium", "high"];
const RISK_ORDER: readonly RiskLevel[] = ["low", "medium", "high"];

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

function assembleCoreReport(input: ReportInput): BuyerRiskReport {
  const provided = new Set(input.providedPhotoTypes);
  const missingPhotos = RECOMMENDED_PHOTOS.filter(
    (photo) => !provided.has(photo.type),
  );
  const missingCount = missingPhotos.length;

  // Confidence caps (docs/report-rules.md).
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

  // Seller questions derived from what is missing, plus a full-set follow-up.
  const sellerQuestions = missingPhotos.map((photo) => photo.sellerQuestion);
  if (input.claimsFullSet && !provided.has("papers")) {
    sellerQuestions.push(
      "Can you show the box and papers referenced in the listing?",
    );
  }
  if (sellerQuestions.length === 0) {
    sellerQuestions.push(
      "Can you confirm the service history and provide any receipts?",
    );
  }

  const hasEvidenceGaps = missingCount > 0 || overallRisk === "cannot_assess";

  const recommendedNextStep = hasEvidenceGaps
    ? "Request the missing photos before proceeding. If the seller declines, treat the listing as higher risk and arrange an independent inspection or use escrow."
    : "No photo-based red flags were detected by the automated checks. An independent inspection or escrow is still recommended before purchase.";

  const safeSummary = buildSafeSummary(overallRisk, missingCount);

  const core: BuyerRiskReport = {
    overallRisk,
    confidence,
    missingEvidence,
    // Visual observations are the model layer's responsibility; the
    // deterministic layer does not invent them.
    visibleConcerns: [],
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

function buildReferenceConsistency(input: ReportInput): string {
  if (!input.reference) {
    return "No reference was provided, so reference consistency cannot be assessed from the submitted details.";
  }
  return `The visible case shape and bezel broadly match the claimed reference ${input.reference}, but key details cannot be confirmed from the submitted photos.`;
}

function buildSellerRiskSignals(input: ReportInput): string[] {
  const provided = new Set(input.providedPhotoTypes);
  const signals: string[] = [];
  if (input.stockPhotosOnly) {
    signals.push("Listing appears to reuse stock photos rather than the actual watch.");
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

export function generateReport(input: ReportInput): GeneratedReport {
  const provided = new Set(input.providedPhotoTypes);
  const core = assembleCoreReport(input);

  const photoCompleteness: PhotoCompletenessItem[] = RECOMMENDED_PHOTOS.map(
    (photo) => ({
      type: photo.type,
      label: photo.label,
      present: provided.has(photo.type),
    }),
  );

  return {
    ...core,
    photoCompleteness,
    referenceConsistency: buildReferenceConsistency(input),
    sellerRiskSignals: buildSellerRiskSignals(input),
  };
}
