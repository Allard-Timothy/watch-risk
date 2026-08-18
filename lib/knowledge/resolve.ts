import type { SellerSeed } from "./schemas";

export type SellerResolution = Readonly<{
  seller: SellerSeed;
  matchedAlias: string;
  identityConfidence: number;
}>;

function normalizeHandle(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

/**
 * Resolve a typed seller handle to a curated seller.
 * Never merges on similar names: only exact sellerId or an explicit alias.
 */
export function resolveSeller(
  sellers: readonly SellerSeed[],
  handle: string | undefined,
): SellerResolution | null {
  if (!handle?.trim()) {
    return null;
  }
  const needle = normalizeHandle(handle);

  for (const seller of sellers) {
    if (normalizeHandle(seller.sellerId) === needle) {
      return {
        seller,
        matchedAlias: seller.sellerId,
        identityConfidence: 1,
      };
    }
    if (normalizeHandle(seller.canonicalName) === needle) {
      return {
        seller,
        matchedAlias: seller.canonicalName,
        identityConfidence: 1,
      };
    }
    const alias = seller.aliases.find(
      (item) => normalizeHandle(item.alias) === needle,
    );
    if (alias) {
      return {
        seller,
        matchedAlias: alias.alias,
        identityConfidence: alias.identityConfidence,
      };
    }
  }

  return null;
}
