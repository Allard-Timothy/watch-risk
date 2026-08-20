import type { QualitativeLabel } from "@/lib/knowledge/enums";
import {
  uniqueIndependenceGroups,
  type RecencyBucket,
} from "@/lib/knowledge/independence";
import type { SellerSeed } from "@/lib/knowledge/schemas";

export type SellerRatingBand = Readonly<{
  key: "overall" | "qc_communication" | "fulfillment";
  label: QualitativeLabel;
  basis: string;
}>;

const LABEL_ORDER: QualitativeLabel[] = [
  "insufficient_evidence",
  "low",
  "medium",
  "high",
  "very_high",
];

function maxLabel(a: QualitativeLabel, b: QualitativeLabel): QualitativeLabel {
  return LABEL_ORDER.indexOf(a) >= LABEL_ORDER.indexOf(b) ? a : b;
}

function dimensionLabel(
  seller: SellerSeed,
  key: string,
): QualitativeLabel | undefined {
  return seller.trustDimensions.find((item) => item.key === key)?.label;
}

function evidenceGroupScore(groupCount: number): QualitativeLabel {
  if (groupCount >= 3) {
    return "high";
  }
  if (groupCount === 2) {
    return "medium";
  }
  if (groupCount === 1) {
    return "low";
  }
  return "insufficient_evidence";
}

function recencyAdjust(
  label: QualitativeLabel,
  bucket: RecencyBucket | undefined,
): QualitativeLabel {
  if (label === "insufficient_evidence" || !bucket) {
    return label;
  }
  if (bucket === "historical" || bucket === "lower") {
    return "low";
  }
  if (bucket === "medium") {
    return maxLabel(label, "medium");
  }
  return label;
}

function hasConflictOfInterest(seller: SellerSeed): boolean {
  return seller.communities.some(
    (item) => item.giveawayOrSponsorshipRelationship,
  );
}

export function computeSellerRatings(seller: SellerSeed): SellerRatingBand[] {
  const groups = uniqueIndependenceGroups(seller.evidence);
  const groupBasis = `Based on ${groups.length} independent evidence group${groups.length === 1 ? "" : "s"}.`;

  let overall =
    dimensionLabel(seller, "overall") ?? evidenceGroupScore(groups.length);
  const fulfillment =
    dimensionLabel(seller, "fulfillment_confidence") ??
    dimensionLabel(seller, "overall") ??
    evidenceGroupScore(groups.length);
  const qcCommunication =
    dimensionLabel(seller, "qc_process_quality") ??
    dimensionLabel(seller, "communication_quality") ??
    dimensionLabel(seller, "overall") ??
    evidenceGroupScore(groups.length);

  if (hasConflictOfInterest(seller)) {
    overall = "medium";
  }

  const recencyBucket = seller.evidenceDepth?.latestEvidenceYear
    ? seller.evidenceDepth.latestEvidenceYear >= new Date().getFullYear() - 1
      ? ("very_high" as RecencyBucket)
      : ("historical" as RecencyBucket)
    : undefined;

  return [
    {
      key: "overall",
      label: recencyAdjust(overall, recencyBucket),
      basis: groupBasis,
    },
    {
      key: "qc_communication",
      label: qcCommunication,
      basis: "Curated QC communication dimension plus evidence breadth.",
    },
    {
      key: "fulfillment",
      label: fulfillment,
      basis: "Curated fulfillment dimension plus evidence breadth.",
    },
  ];
}

export function ratingLabelCopy(label: QualitativeLabel): string {
  const copy: Record<QualitativeLabel, string> = {
    very_high: "Very high",
    high: "High",
    medium: "Medium",
    low: "Low",
    insufficient_evidence: "Insufficient evidence",
  };
  return copy[label];
}
