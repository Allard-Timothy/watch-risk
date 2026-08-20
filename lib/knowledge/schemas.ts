import { z } from "zod";

import {
  CLAIM_SENTIMENTS,
  COMMUNITY_RECOGNITION_STATUSES,
  EVIDENCE_KINDS,
  QUALITATIVE_LABELS,
  RISK_CATEGORIES,
  SELLER_LIFECYCLE_STATUSES,
  SOURCE_KINDS,
  TRUST_DIMENSION_KEYS,
} from "./enums";

const optionalDate = z.string().trim().min(1).optional();

const confidence = z.number().min(0).max(1);

export const communitySeedSchema = z.object({
  id: z.string().trim().min(1).max(80),
  displayName: z.string().trim().min(1).max(120),
  independenceGroup: z.string().trim().min(1).max(80),
  formalTdProgram: z.boolean().default(false),
  notes: z.string().max(8000).optional(),
  vettingNotes: z.string().max(8000).optional(),
});
export type CommunitySeed = z.infer<typeof communitySeedSchema>;

export const sellerAliasSeedSchema = z.object({
  alias: z.string().trim().min(1).max(120),
  identityConfidence: confidence,
  evidenceNote: z.string().max(2000).optional(),
});
export type SellerAliasSeed = z.infer<typeof sellerAliasSeedSchema>;

export const sellerCommunitySeedSchema = z.object({
  communityId: z.string().trim().min(1).max(80),
  status: z.enum(COMMUNITY_RECOGNITION_STATUSES),
  statusSince: optionalDate,
  moderatorVetted: z.boolean().default(false),
  formalTdProgram: z.boolean().default(false),
  sellerParticipationRequired: z.boolean().default(false),
  giveawayOrSponsorshipRelationship: z.boolean().default(false),
  notes: z.string().max(4000).optional(),
});
export type SellerCommunitySeed = z.infer<typeof sellerCommunitySeedSchema>;

export const trustDimensionSeedSchema = z.object({
  key: z.enum(TRUST_DIMENSION_KEYS),
  label: z.enum(QUALITATIVE_LABELS),
  notes: z.string().max(2000).optional(),
});
export type TrustDimensionSeed = z.infer<typeof trustDimensionSeedSchema>;

export const riskFlagSeedSchema = z.object({
  category: z.enum(RISK_CATEGORIES),
  label: z.enum(QUALITATIVE_LABELS),
  summary: z.string().trim().min(1).max(2000),
});
export type RiskFlagSeed = z.infer<typeof riskFlagSeedSchema>;

export const sourceSeedSchema = z.object({
  id: z.string().trim().min(1).max(80),
  kind: z.enum(SOURCE_KINDS),
  communityId: z.string().trim().min(1).max(80).optional(),
  title: z.string().trim().min(1).max(240),
  url: z.string().url().optional(),
  publishedAt: optionalDate,
  retrievedAt: optionalDate,
  independenceGroup: z.string().trim().min(1).max(80),
});
export type SourceSeed = z.infer<typeof sourceSeedSchema>;

export const evidenceSeedSchema = z.object({
  communityId: z.string().trim().min(1).max(80).optional(),
  sourceId: z.string().trim().min(1).max(80).optional(),
  evidenceType: z.enum(EVIDENCE_KINDS),
  independenceGroup: z.string().trim().min(1).max(80),
  claimText: z.string().trim().min(1).max(4000),
  sentiment: z.enum(CLAIM_SENTIMENTS).optional(),
  confidence: confidence.optional(),
  publishedAt: optionalDate,
  retrievedAt: optionalDate,
  sourceUrl: z.string().url().optional(),
});
export type EvidenceSeed = z.infer<typeof evidenceSeedSchema>;

export const claimSeedSchema = z.object({
  subjectType: z.string().trim().min(1).max(40),
  subjectId: z.string().trim().min(1).max(80),
  predicate: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(2000),
  sourceId: z.string().trim().min(1).max(80).optional(),
  confidence: confidence.optional(),
  observedAt: optionalDate,
});
export type ClaimSeed = z.infer<typeof claimSeedSchema>;

export const evidenceDepthSeedSchema = z.object({
  transactionReports: z.number().int().nonnegative().optional(),
  communitiesRepresented: z.number().int().nonnegative().optional(),
  oldestKnownTransactionYear: z.number().int().min(1990).max(2100).optional(),
  latestEvidenceYear: z.number().int().min(1990).max(2100).optional(),
  unresolvedDisputesKnown: z.number().int().nonnegative().optional(),
});
export type EvidenceDepthSeed = z.infer<typeof evidenceDepthSeedSchema>;

export const sellerSeedSchema = z.object({
  sellerId: z.string().trim().min(1).max(80),
  canonicalName: z.string().trim().min(1).max(120),
  status: z.enum(SELLER_LIFECYCLE_STATUSES).default("active"),
  aliases: z.array(sellerAliasSeedSchema).default([]),
  communities: z.array(sellerCommunitySeedSchema).default([]),
  trustDimensions: z.array(trustDimensionSeedSchema).default([]),
  riskFlags: z.array(riskFlagSeedSchema).default([]),
  likes: z.array(z.string().trim().min(1).max(500)).default([]),
  concerns: z.array(z.string().trim().min(1).max(500)).default([]),
  interpretation: z.string().max(8000).optional(),
  evidence: z.array(evidenceSeedSchema).default([]),
  claims: z.array(claimSeedSchema).default([]),
  evidenceDepth: evidenceDepthSeedSchema.optional(),
});
export type SellerSeed = z.infer<typeof sellerSeedSchema>;

export const communityCompareCaseSchema = z.object({
  id: z.string().trim().min(1).max(80),
  communityAId: z.string().trim().min(1).max(80),
  communityBId: z.string().trim().min(1).max(80),
  conclusion: z.string().trim().min(1).max(8000),
  vettingDifferences: z.array(z.string().trim().min(1).max(1000)).default([]),
  demographicNotes: z.array(z.string().trim().min(1).max(1000)).default([]),
  incentiveNotes: z.array(z.string().trim().min(1).max(1000)).default([]),
});
export type CommunityCompareCase = z.infer<typeof communityCompareCaseSchema>;

export const knownVarianceSeedSchema = z.object({
  area: z.string().trim().min(1).max(80),
  photoType: z.string().trim().min(1).max(40).optional(),
  whatBuyersShouldLookFor: z.string().trim().min(1).max(2000),
  whatPhotosCannotShow: z.string().trim().min(1).max(2000),
});
export type KnownVarianceSeed = z.infer<typeof knownVarianceSeedSchema>;

export const highValueCheckSeedSchema = z.object({
  area: z.string().trim().min(1).max(80),
  photoType: z.string().trim().min(1).max(40).optional(),
  sellerQuestion: z.string().trim().min(1).max(2000),
});
export type HighValueCheckSeed = z.infer<typeof highValueCheckSeedSchema>;

export const modelDossierSeedSchema = z.object({
  id: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(80),
  modelFamily: z.string().trim().min(1).max(80),
  reference: z.string().trim().min(1).max(80),
  factory: z.string().trim().min(1).max(80).optional(),
  requiredPhotos: z.array(z.string().trim().min(1).max(40)).min(1),
  optionalPhotos: z.array(z.string().trim().min(1).max(40)).default([]),
  riskCheckpoints: z
    .record(z.string(), z.array(z.string().trim().min(1).max(200)))
    .default({}),
  factoryVersion: z.string().trim().min(1).max(80).optional(),
  caseSize: z.string().trim().min(1).max(80).optional(),
  movementFamily: z.string().trim().min(1).max(120).optional(),
  braceletOptions: z.array(z.string().trim().min(1).max(120)).default([]),
  claspType: z.string().trim().min(1).max(120).optional(),
  bezelType: z.string().trim().min(1).max(120).optional(),
  dialVariants: z.array(z.string().trim().min(1).max(120)).default([]),
  knownVariance: z.array(knownVarianceSeedSchema).default([]),
  highValueChecks: z.array(highValueCheckSeedSchema).default([]),
  notes: z.string().max(4000).optional(),
});
export type ModelDossierSeed = z.infer<typeof modelDossierSeedSchema>;

export const factoryVersionSeedSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(120),
  notes: z.string().max(4000).optional(),
});
export type FactoryVersionSeed = z.infer<typeof factoryVersionSeedSchema>;

export const defectSeedSchema = z.object({
  id: z.string().trim().min(1).max(80),
  area: z.string().trim().min(1).max(80),
  photoType: z.string().trim().min(1).max(40).optional(),
  whatBuyersShouldLookFor: z.string().trim().min(1).max(2000),
  whatPhotosCannotShow: z.string().trim().min(1).max(2000),
  references: z.array(z.string().trim().min(1).max(80)).default([]),
  factoryVersionId: z.string().trim().min(1).max(80).optional(),
});
export type DefectSeed = z.infer<typeof defectSeedSchema>;

export const factorySeedSchema = z.object({
  factoryId: z.string().trim().min(1).max(80),
  canonicalName: z.string().trim().min(1).max(120),
  notes: z.string().max(8000).optional(),
  versions: z.array(factoryVersionSeedSchema).default([]),
  defects: z.array(defectSeedSchema).default([]),
});
export type FactorySeed = z.infer<typeof factorySeedSchema>;
