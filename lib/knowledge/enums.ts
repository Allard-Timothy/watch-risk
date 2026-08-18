/**
 * On-the-wire knowledge enums. Prisma stores the uppercase form
 * (`PROVISIONARY_TD`); JSON seeds and Zod use snake_case (`provisionary_td`).
 */

export const SELLER_LIFECYCLE_STATUSES = [
  "active",
  "inactive",
  "unknown",
] as const;
export type SellerLifecycleStatus = (typeof SELLER_LIFECYCLE_STATUSES)[number];

export const COMMUNITY_RECOGNITION_STATUSES = [
  "full_td",
  "provisionary_td",
  "trusted_seller",
  "established_seller",
  "recommended_seller",
  "listed_seller",
  "former_td",
  "removed_td",
  "banned",
  "unknown",
] as const;
export type CommunityRecognitionStatus =
  (typeof COMMUNITY_RECOGNITION_STATUSES)[number];

export const QUALITATIVE_LABELS = [
  "very_high",
  "high",
  "medium",
  "low",
  "insufficient_evidence",
] as const;
export type QualitativeLabel = (typeof QUALITATIVE_LABELS)[number];

export const QUALITATIVE_LABEL_COPY: Record<QualitativeLabel, string> = {
  very_high: "Very High",
  high: "High",
  medium: "Medium",
  low: "Low",
  insufficient_evidence: "Insufficient Evidence",
};

export const RISK_CATEGORIES = [
  "fraud",
  "operational",
  "qc",
  "after_sales",
  "product_claim",
] as const;
export type RiskCategory = (typeof RISK_CATEGORIES)[number];

export const EVIDENCE_KINDS = [
  "td_listing",
  "moderator_review",
  "moderator_test_purchase",
  "buyer_review",
  "transaction_report",
  "giveaway_or_sponsorship",
  "seller_promotion",
  "forum_status",
  "independent_review",
  "other",
] as const;
export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const SOURCE_KINDS = [
  "forum",
  "reddit",
  "website",
  "manual_curation",
  "other",
] as const;
export type SourceKind = (typeof SOURCE_KINDS)[number];

export const CLAIM_SENTIMENTS = [
  "positive",
  "negative",
  "mixed",
  "neutral",
] as const;
export type ClaimSentiment = (typeof CLAIM_SENTIMENTS)[number];

export const TRUST_DIMENSION_KEYS = [
  "legitimacy_confidence",
  "fulfillment_confidence",
  "communication_quality",
  "qc_process_quality",
  "after_sales_support",
  "refund_dispute_behavior",
  "customs_reship_policy",
  "product_claim_accuracy",
  "pricing_competitiveness",
  "longevity",
  "cross_community_validation",
  "evidence_volume",
  "evidence_recency",
  "overall",
] as const;
export type TrustDimensionKey = (typeof TRUST_DIMENSION_KEYS)[number];

export const TRUST_DIMENSION_COPY: Record<TrustDimensionKey, string> = {
  legitimacy_confidence: "Legitimacy",
  fulfillment_confidence: "Fulfillment",
  communication_quality: "Communication",
  qc_process_quality: "QC Process",
  after_sales_support: "After-Sales",
  refund_dispute_behavior: "Refund / dispute behavior",
  customs_reship_policy: "Customs / reship policy",
  product_claim_accuracy: "Product-claim accuracy",
  pricing_competitiveness: "Pricing",
  longevity: "Longevity",
  cross_community_validation: "Cross-community validation",
  evidence_volume: "Evidence volume",
  evidence_recency: "Evidence recency",
  overall: "WatchTell confidence",
};

export function toPrismaEnum<T extends string>(value: string): T {
  return value.toUpperCase() as T;
}

export function fromPrismaEnum<T extends string>(value: string): T {
  return value.toLowerCase() as T;
}
