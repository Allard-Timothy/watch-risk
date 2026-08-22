import { describe, expect, it } from "vitest";

import { matchIntakeSeller, resolveSeller } from "./resolve";
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
const yan = sellerSeedSchema.parse({
  sellerId: "yan-tao",
  canonicalName: "Yan Tao",
  aliases: [{ alias: "RXMB", identityConfidence: 0.8 }],
});

describe("resolveSeller handle normalization", () => {
  it("treats spaces, hyphens, and underscores as the same handle", () => {
    expect(resolveSeller([ddg], "ddg-top")?.seller.sellerId).toBe("ddgtop");
    expect(resolveSeller([ddg], "DDG_Top")?.seller.sellerId).toBe("ddgtop");
    expect(resolveSeller([ddg], "DDG_Top")?.identityConfidence).toBe(1);
    expect(resolveSeller([lin], "Lin-Seller")?.seller.sellerId).toBe(
      "lin-seller",
    );
    expect(resolveSeller([lin], "lin_seller")?.identityConfidence).toBe(1);
    expect(resolveSeller([yan], "rxmb")?.matchedAlias).toBe("RXMB");
    expect(resolveSeller([yan], "RXMB")?.identityConfidence).toBe(0.8);
  });

  it("matches Lin Feng after stripping punctuation, but never merges Lin Seller into that row", () => {
    const sellers = [lin, feng];
    expect(resolveSeller(sellers, "lin-seller")?.seller.sellerId).toBe(
      "lin-seller",
    );
    expect(resolveSeller(sellers, "LinFeng")?.seller.sellerId).toBe("lin-feng");
    expect(resolveSeller(sellers, "Lin Seller")?.seller.sellerId).toBe(
      "lin-seller",
    );
    expect(matchIntakeSeller(sellers, "Lin")).toEqual({
      kind: "unresolved",
      handle: "Lin",
    });
  });
});
