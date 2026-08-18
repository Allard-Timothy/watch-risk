import type {
  ClaimSentiment,
  CommunityRecognitionStatus,
  EvidenceKind,
  QualitativeLabel,
  RiskCategory,
  SellerLifecycleStatus,
  SourceKind,
} from "@prisma/client";

import { getDbClient } from "@/lib/db";
import { fromPrismaEnum, toPrismaEnum } from "./enums";
import type { CommunitySeed, SellerSeed } from "./schemas";

function parseOptionalDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export async function upsertCommunity(seed: CommunitySeed) {
  const db = getDbClient();
  return db.community.upsert({
    where: { id: seed.id },
    create: {
      id: seed.id,
      displayName: seed.displayName,
      independenceGroup: seed.independenceGroup,
      formalTdProgram: seed.formalTdProgram,
      notes: seed.notes,
      vettingNotes: seed.vettingNotes,
    },
    update: {
      displayName: seed.displayName,
      independenceGroup: seed.independenceGroup,
      formalTdProgram: seed.formalTdProgram,
      notes: seed.notes,
      vettingNotes: seed.vettingNotes,
    },
  });
}

export async function upsertSeller(seed: SellerSeed) {
  const db = getDbClient();

  await db.seller.upsert({
    where: { id: seed.sellerId },
    create: {
      id: seed.sellerId,
      canonicalName: seed.canonicalName,
      status: toPrismaEnum<SellerLifecycleStatus>(seed.status),
      likes: seed.likes,
      concerns: seed.concerns,
      interpretation: seed.interpretation,
    },
    update: {
      canonicalName: seed.canonicalName,
      status: toPrismaEnum<SellerLifecycleStatus>(seed.status),
      likes: seed.likes,
      concerns: seed.concerns,
      interpretation: seed.interpretation,
    },
  });

  await db.sellerAlias.deleteMany({ where: { sellerId: seed.sellerId } });
  if (seed.aliases.length > 0) {
    await db.sellerAlias.createMany({
      data: seed.aliases.map((alias) => ({
        sellerId: seed.sellerId,
        alias: alias.alias,
        identityConfidence: alias.identityConfidence,
        evidenceNote: alias.evidenceNote,
      })),
    });
  }

  await db.sellerCommunity.deleteMany({ where: { sellerId: seed.sellerId } });
  for (const community of seed.communities) {
    await db.sellerCommunity.create({
      data: {
        sellerId: seed.sellerId,
        communityId: community.communityId,
        status: toPrismaEnum<CommunityRecognitionStatus>(community.status),
        statusSince: parseOptionalDate(community.statusSince),
        moderatorVetted: community.moderatorVetted,
        formalTdProgram: community.formalTdProgram,
        sellerParticipationRequired: community.sellerParticipationRequired,
        giveawayOrSponsorshipRelationship:
          community.giveawayOrSponsorshipRelationship,
        notes: community.notes,
      },
    });
  }

  await db.trustDimension.deleteMany({ where: { sellerId: seed.sellerId } });
  if (seed.trustDimensions.length > 0) {
    await db.trustDimension.createMany({
      data: seed.trustDimensions.map((dimension) => ({
        sellerId: seed.sellerId,
        key: dimension.key,
        label: toPrismaEnum<QualitativeLabel>(dimension.label),
        notes: dimension.notes,
      })),
    });
  }

  await db.riskFlag.deleteMany({ where: { sellerId: seed.sellerId } });
  if (seed.riskFlags.length > 0) {
    await db.riskFlag.createMany({
      data: seed.riskFlags.map((flag) => ({
        sellerId: seed.sellerId,
        category: toPrismaEnum<RiskCategory>(flag.category),
        label: toPrismaEnum<QualitativeLabel>(flag.label),
        summary: flag.summary,
      })),
    });
  }

  await db.evidence.deleteMany({ where: { sellerId: seed.sellerId } });
  for (const item of seed.evidence) {
    await db.evidence.create({
      data: {
        sellerId: seed.sellerId,
        communityId: item.communityId,
        sourceId: item.sourceId,
        evidenceType: toPrismaEnum<EvidenceKind>(item.evidenceType),
        independenceGroup: item.independenceGroup,
        claimText: item.claimText,
        sentiment: item.sentiment
          ? toPrismaEnum<ClaimSentiment>(item.sentiment)
          : undefined,
        confidence: item.confidence,
        publishedAt: parseOptionalDate(item.publishedAt),
        retrievedAt: parseOptionalDate(item.retrievedAt),
        sourceUrl: item.sourceUrl,
      },
    });
  }

  return getSeller(seed.sellerId);
}

export async function getSeller(id: string) {
  const db = getDbClient();
  return db.seller.findUnique({
    where: { id },
    include: {
      aliases: true,
      communities: { include: { community: true } },
      trustDimensions: true,
      riskFlags: true,
      evidence: true,
    },
  });
}

export function recognitionStatusFromPrisma(
  value: CommunityRecognitionStatus,
) {
  return fromPrismaEnum<string>(value);
}

export function sourceKindToPrisma(kind: string): SourceKind {
  return toPrismaEnum<SourceKind>(kind);
}
