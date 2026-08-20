import type { SellerSeed } from "./schemas";

export type SellerResolution = Readonly<{
  seller: SellerSeed;
  matchedAlias: string;
  identityConfidence: number;
}>;

export type IntakeSellerMatch =
  | Readonly<{ kind: "none" }>
  | Readonly<{ kind: "resolved" } & SellerResolution>
  | Readonly<{ kind: "unresolved"; handle: string }>;

/** Prefix stored in listingText so unmatched handles survive without a new column. */
export const UNRESOLVED_HANDLE_MARKER = "[[watchtell:unresolved-seller]]";

export function unresolvedSellerCopy(handle: string): string {
  return `typed ${handle.trim()}, no curated match`;
}

export function encodeUnresolvedHandle(
  listingText: string | undefined,
  handle: string | undefined,
): string | undefined {
  const cleaned = handle?.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return listingText;
  }
  const line = `${UNRESOLVED_HANDLE_MARKER}${cleaned}`;
  return listingText ? `${line}\n${listingText}` : line;
}

export function decodeUnresolvedHandle(listingText: string | undefined): {
  listingText?: string;
  typedSellerHandle?: string;
} {
  if (!listingText?.startsWith(UNRESOLVED_HANDLE_MARKER)) {
    return { listingText: listingText || undefined };
  }
  const rest = listingText.slice(UNRESOLVED_HANDLE_MARKER.length);
  const newline = rest.indexOf("\n");
  if (newline === -1) {
    return { typedSellerHandle: rest || undefined };
  }
  return {
    typedSellerHandle: rest.slice(0, newline) || undefined,
    listingText: rest.slice(newline + 1) || undefined,
  };
}

export function matchIntakeSeller(
  sellers: readonly SellerSeed[],
  handle: string | undefined,
): IntakeSellerMatch {
  const trimmed = handle?.trim();
  if (!trimmed) {
    return { kind: "none" };
  }
  const resolved = resolveSeller(sellers, trimmed);
  if (resolved) {
    return { kind: "resolved", ...resolved };
  }
  return { kind: "unresolved", handle: trimmed };
}

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
