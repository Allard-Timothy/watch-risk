import type { CommunityRecognitionStatus } from "./enums";
import type { SellerSeed } from "./schemas";

const CURRENT_RECOGNITION = new Set<CommunityRecognitionStatus>([
  "full_td",
  "provisionary_td",
  "trusted_seller",
  "established_seller",
  "recommended_seller",
  "listed_seller",
]);

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
