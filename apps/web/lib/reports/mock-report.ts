import type { BuyerRiskReport, ImageFinding } from "@/lib/types";
import type { DetectedPhotoType } from "@/lib/validation";

/**
 * Mock buyer-risk report for the placeholder report page.
 *
 * This is static sample data only. No model is called and nothing is persisted.
 * All user-facing language follows docs/report-rules.md and avoids the forbidden
 * conclusion words (authentic, genuine, fake, counterfeit, certified, verified,
 * guaranteed, passed).
 */

export type PhotoCompletenessItem = Readonly<{
  type: DetectedPhotoType;
  label: string;
  present: boolean;
}>;

export type MockReport = BuyerRiskReport &
  Readonly<{
    reportId: string;
    generatedAt: string;
    watch: Readonly<{
      brand: string;
      model: string;
      reference: string;
      claimedYear: string;
      askingPrice: number;
      sellerPlatform: string;
    }>;
    photoCompleteness: readonly PhotoCompletenessItem[];
    referenceConsistency: string;
    sellerRiskSignals: readonly string[];
  }>;

const visibleConcerns: ImageFinding[] = [
  {
    area: "Dial printing",
    severity: "medium",
    finding:
      "Minute-track spacing looks slightly uneven in the single dial photo provided.",
    visibleEvidence: "Angled dial image, glare across the 12 o'clock area.",
    uncertainty:
      "The angle and reflection limit certainty; a straight-on macro is needed.",
  },
  {
    area: "Date window",
    severity: "low",
    finding:
      "Cyclops magnification and date centering are hard to judge from the submitted angle.",
    visibleEvidence: "Date visible at 3 o'clock in the wrist-shot only.",
    uncertainty: "No straight-on date macro was submitted.",
  },
];

export const mockReport: MockReport = {
  reportId: "WR-2026-0481",
  generatedAt: "June 7, 2026",
  watch: {
    brand: "Tudor",
    model: "Black Bay 58",
    reference: "79030N",
    claimedYear: "2022",
    askingPrice: 2950,
    sellerPlatform: "Chrono24",
  },
  overallRisk: "medium",
  confidence: "low",
  photoCompleteness: [
    { type: "dial", label: "Dial", present: true },
    { type: "caseback", label: "Caseback", present: true },
    { type: "bracelet", label: "Bracelet / strap", present: true },
    { type: "rehaut", label: "Rehaut", present: false },
    { type: "clasp", label: "Clasp", present: false },
    { type: "movement", label: "Movement", present: false },
  ],
  missingEvidence: [
    "Straight-on dial macro in natural light",
    "Clear clasp and end-link photos",
    "Movement photo, or an offer of independent inspection",
  ],
  visibleConcerns,
  referenceConsistency:
    "The visible case shape and bezel broadly match the claimed reference, but key details cannot be checked from the submitted photos.",
  sellerRiskSignals: [
    "Listing uses a single wrist shot for most detail areas.",
    "No box or papers shown, though the listing claims a full set.",
  ],
  sellerQuestions: [
    "Can you share a straight-on dial photo in natural light?",
    "Can you photograph the clasp, end links, and bracelet stamps?",
    "Can you provide a movement photo, or allow an independent inspection?",
    "Can you show the box and papers referenced in the listing?",
  ],
  recommendedNextStep:
    "Request the missing photos before proceeding. If the seller declines, treat the listing as higher risk and arrange an independent inspection or use escrow.",
  safeSummary:
    "The submitted photo set is incomplete, so this listing cannot be given a low visible-risk rating yet. Treat it as a medium-risk listing pending more evidence.",
};
