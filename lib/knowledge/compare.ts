import {
  COMMUNITY_RECOGNITION_STATUSES,
  type CommunityRecognitionStatus,
} from "./enums";
import type { SellerSeed } from "./schemas";

export const DEFAULT_COMPARE_COMMUNITY_A = "reptime";
export const DEFAULT_COMPARE_COMMUNITY_B = "repwatchforum";

const CURRENT_RECOGNITION = new Set<CommunityRecognitionStatus>([
  "full_td",
  "provisionary_td",
  "trusted_seller",
  "established_seller",
  "recommended_seller",
  "listed_seller",
]);

export type SellerIndexFilters = Readonly<{
  communityId?: string;
  status?: CommunityRecognitionStatus;
}>;

export function parseRecognitionStatus(
  value: string | undefined,
): CommunityRecognitionStatus | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return COMMUNITY_RECOGNITION_STATUSES.find((status) => status === trimmed);
}

export function resolveComparePair(params: {
  a?: string;
  b?: string;
}): Readonly<{ communityAId: string; communityBId: string }> {
  const a = params.a?.trim();
  const b = params.b?.trim();
  return {
    communityAId: a ? a : DEFAULT_COMPARE_COMMUNITY_A,
    communityBId: b ? b : DEFAULT_COMPARE_COMMUNITY_B,
  };
}

export function filterSellers(
  sellers: readonly SellerSeed[],
  filters: SellerIndexFilters,
): SellerSeed[] {
  const communityId = filters.communityId?.trim();
  const status = filters.status;
  if (!communityId && !status) {
    return [...sellers];
  }
  return sellers.filter((seller) =>
    seller.communities.some((record) => {
      if (communityId && record.communityId !== communityId) {
        return false;
      }
      if (status && record.status !== status) {
        return false;
      }
      return true;
    }),
  );
}

export function sellerRecognizedIn(
  seller: SellerSeed,
  communityId: string,
): boolean {
  return seller.communities.some(
    (record) =>
      record.communityId === communityId &&
      CURRENT_RECOGNITION.has(record.status),
  );
}

export function compareCommunitySellers(
  sellers: readonly SellerSeed[],
  communityAId: string,
  communityBId: string,
) {
  const inA = sellers.filter((seller) =>
    sellerRecognizedIn(seller, communityAId),
  );
  const inB = sellers.filter((seller) =>
    sellerRecognizedIn(seller, communityBId),
  );
  const idsB = new Set(inB.map((seller) => seller.sellerId));
  const idsA = new Set(inA.map((seller) => seller.sellerId));
  const both = inA.filter((seller) => idsB.has(seller.sellerId));
  const onlyA = inA.filter((seller) => !idsB.has(seller.sellerId));
  const onlyB = inB.filter((seller) => !idsA.has(seller.sellerId));
  const union = new Set([...idsA, ...idsB]).size;
  const overlapPercent =
    union === 0 ? 0 : Math.round((both.length / union) * 100);

  return {
    communityAId,
    communityBId,
    both,
    onlyA,
    onlyB,
    overlapPercent,
  };
}
