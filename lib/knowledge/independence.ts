import type {
  CommunitySeed,
  EvidenceSeed,
  SellerCommunitySeed,
  SellerSeed,
} from "./schemas";

/**
 * Evidence from the same forum/ecosystem is one confirmation, not N.
 * RWF TD listing + RWF moderator review + RWF giveaway share one group.
 */
export function uniqueIndependenceGroups(
  evidence: readonly Pick<EvidenceSeed, "independenceGroup">[],
): string[] {
  return [...new Set(evidence.map((item) => item.independenceGroup))];
}

export function evidenceByIndependenceGroup(
  evidence: readonly EvidenceSeed[],
): Map<string, EvidenceSeed[]> {
  const grouped = new Map<string, EvidenceSeed[]>();
  for (const item of evidence) {
    const current = grouped.get(item.independenceGroup) ?? [];
    current.push(item);
    grouped.set(item.independenceGroup, current);
  }
  return grouped;
}

export type RecencyBucket =
  | "very_high"
  | "high"
  | "medium"
  | "lower"
  | "historical";

export type RecognitionIndependenceGroup = Readonly<{
  independenceGroup: string;
  recognitions: readonly (SellerCommunitySeed & { displayName: string })[];
}>;

/**
 * Group a seller's community records by the community's independence group.
 * RWF TD listing and RWF giveaway stay one group, not two confirmations.
 */
export function recognitionsByIndependenceGroup(
  seller: SellerSeed,
  communities: readonly CommunitySeed[],
): RecognitionIndependenceGroup[] {
  const byId = new Map(communities.map((community) => [community.id, community]));
  const grouped = new Map<
    string,
    Array<SellerCommunitySeed & { displayName: string }>
  >();

  for (const recognition of seller.communities) {
    const community = byId.get(recognition.communityId);
    const independenceGroup =
      community?.independenceGroup ?? recognition.communityId;
    const current = grouped.get(independenceGroup) ?? [];
    current.push({
      ...recognition,
      displayName: community?.displayName ?? recognition.communityId,
    });
    grouped.set(independenceGroup, current);
  }

  return [...grouped.entries()].map(([independenceGroup, recognitions]) => ({
    independenceGroup,
    recognitions,
  }));
}

export function recencyBucket(
  publishedAt: string | undefined,
  now: Date = new Date(),
): RecencyBucket | undefined {
  if (!publishedAt) {
    return undefined;
  }
  const then = new Date(publishedAt);
  if (Number.isNaN(then.getTime())) {
    return undefined;
  }
  const months =
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
  if (months < 6) return "very_high";
  if (months < 12) return "high";
  if (months < 24) return "medium";
  if (months < 48) return "lower";
  return "historical";
}
