import { describe, expect, it } from "vitest";

import { resolveSeller } from "./resolve";
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
