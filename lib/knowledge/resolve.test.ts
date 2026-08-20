import { describe, expect, it } from "vitest";

import {
  decodeUnresolvedHandle,
  encodeUnresolvedHandle,
  matchIntakeSeller,
  resolveSeller,
  unresolvedSellerCopy,
} from "./resolve";
import { sellerSeedSchema } from "./schemas";

const lin = sellerSeedSchema.parse({
  sellerId: "lin-seller",
  canonicalName: "Lin Seller",
  aliases: [],
});
const feng = sellerSeedSchema.parse({
  sellerId: "lin-feng",
  canonicalName: "Lin Feng",
  aliases: [],
});
const ddg = sellerSeedSchema.parse({
  sellerId: "ddgtop",
  canonicalName: "DDGTOP",
  aliases: [{ alias: "DDG Top", identityConfidence: 0.95 }],
});

describe("resolveSeller", () => {
  it("matches an explicit alias and seller id", () => {
    expect(resolveSeller([ddg], "DDG Top")?.seller.sellerId).toBe("ddgtop");
    expect(resolveSeller([ddg], "ddgtop")?.identityConfidence).toBe(1);
  });

  it("does not merge Lin Seller with Lin Feng on similar names", () => {
    const sellers = [lin, feng];
    expect(resolveSeller(sellers, "Lin Seller")?.seller.sellerId).toBe(
      "lin-seller",
    );
    expect(resolveSeller(sellers, "Lin Feng")?.seller.sellerId).toBe("lin-feng");
    expect(resolveSeller(sellers, "Lin")).toBeNull();
  });
});

describe("unresolved intake handles", () => {
  it("keeps the typed handle when no curated match exists", () => {
    expect(matchIntakeSeller([ddg], "NotADealer")).toEqual({
      kind: "unresolved",
      handle: "NotADealer",
    });
    expect(unresolvedSellerCopy("NotADealer")).toBe(
      "typed NotADealer, no curated match",
    );
  });

  it("returns none when the handle is blank", () => {
    expect(matchIntakeSeller([ddg], "  ")).toEqual({ kind: "none" });
  });

  it("round-trips an unmatched handle through listing text", () => {
    const stored = encodeUnresolvedHandle("Seller description", "NotADealer");
    expect(stored).toBe(
      "[[watchtell:unresolved-seller]]NotADealer\nSeller description",
    );
    expect(decodeUnresolvedHandle(stored)).toEqual({
      typedSellerHandle: "NotADealer",
      listingText: "Seller description",
    });
    expect(decodeUnresolvedHandle("plain listing")).toEqual({
      listingText: "plain listing",
    });
  });
});
