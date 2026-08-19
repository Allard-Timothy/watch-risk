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
import type { CommunitySeed, FactorySeed, SellerSeed } from "./schemas";

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

/**
 * Upsert a resolved seller and the communities it references so
 * `WatchCase.sellerId` can be stored without a missing-FK error.
 */
export async function ensureSellerPersisted(
  seed: SellerSeed,
  communities: readonly CommunitySeed[],
): Promise<void> {
  const needed = new Set(
    [
      ...seed.communities.map((item) => item.communityId),
      ...seed.evidence.map((item) => item.communityId),
    ].filter((id): id is string => Boolean(id)),
  );
  for (const community of communities) {
    if (needed.has(community.id)) {
      await upsertCommunity(community);
    }
  }
  await upsertSeller(seed);
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

export function assertFactorySeed(seed: FactorySeed): FactorySeed {
  const versionIds = new Set(seed.versions.map((version) => version.id));
  for (const defect of seed.defects) {
    if (defect.factoryVersionId && !versionIds.has(defect.factoryVersionId)) {
      throw new Error(
        `Defect ${defect.id} references unknown factory version ${defect.factoryVersionId}`,
      );
    }
  }
  return seed;
}

export async function upsertFactory(seed: FactorySeed) {
  const db = getDbClient();
  assertFactorySeed(seed);

  await db.factory.upsert({
    where: { id: seed.factoryId },
    create: {
      id: seed.factoryId,
      canonicalName: seed.canonicalName,
      notes: seed.notes,
    },
    update: {
      canonicalName: seed.canonicalName,
      notes: seed.notes,
    },
  });

  await db.defect.deleteMany({ where: { factoryId: seed.factoryId } });
  await db.factoryVersion.deleteMany({ where: { factoryId: seed.factoryId } });

  if (seed.versions.length > 0) {
    await db.factoryVersion.createMany({
      data: seed.versions.map((version) => ({
        id: version.id,
        factoryId: seed.factoryId,
        label: version.label,
        notes: version.notes,
      })),
    });
  }

  if (seed.defects.length > 0) {
    await db.defect.createMany({
      data: seed.defects.map((defect) => ({
        id: defect.id,
        factoryId: seed.factoryId,
        factoryVersionId: defect.factoryVersionId,
        area: defect.area,
        photoType: defect.photoType,
        whatBuyersShouldLookFor: defect.whatBuyersShouldLookFor,
        whatPhotosCannotShow: defect.whatPhotosCannotShow,
        references: defect.references,
      })),
    });
  }

  return getFactory(seed.factoryId);
}

export async function getFactory(id: string) {
  const db = getDbClient();
  return db.factory.findUnique({
    where: { id },
    include: { versions: true, defects: true },
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
