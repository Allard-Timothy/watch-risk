import { describe, expect, it } from "vitest";

import {
  compareCommunitySellers,
  filterSellers,
  parseRecognitionStatus,
  resolveComparePair,
} from "./compare";
import { sellerSeedSchema } from "./schemas";

const jtime = sellerSeedSchema.parse({
  sellerId: "jtime",
  canonicalName: "JTime",
  communities: [
    { communityId: "rwi", status: "trusted_seller" },
    { communityId: "repgeek", status: "trusted_seller" },
    { communityId: "repwatchforum", status: "unknown" },
  ],
});
const ddg = sellerSeedSchema.parse({
  sellerId: "ddgtop",
  canonicalName: "DDGTOP",
  communities: [
    { communityId: "repwatchforum", status: "provisionary_td" },
    { communityId: "rwi", status: "unknown" },
  ],
});
const banned = sellerSeedSchema.parse({
  sellerId: "former-td",
  canonicalName: "Former TD",
  communities: [{ communityId: "rwi", status: "former_td" }],
});

const sellers = [jtime, ddg, banned];

describe("resolveComparePair", () => {
  it("defaults to reptime vs repwatchforum", () => {
    expect(resolveComparePair({})).toEqual({
      communityAId: "reptime",
      communityBId: "repwatchforum",
    });
  });

  it("accepts any two community ids", () => {
    expect(resolveComparePair({ a: "rwi", b: "repgeek" })).toEqual({
      communityAId: "rwi",
      communityBId: "repgeek",
    });
    expect(resolveComparePair({ a: "made-up", b: "chinatime" })).toEqual({
      communityAId: "made-up",
      communityBId: "chinatime",
    });
  });
});

describe("compareCommunitySellers", () => {
  it("compares any two community ids from current recognition lists", () => {
    const result = compareCommunitySellers(sellers, "rwi", "repgeek");
    expect(result.both.map((seller) => seller.sellerId)).toEqual(["jtime"]);
    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
    expect(result.overlapPercent).toBe(100);
  });

  it("returns empty overlap for unknown community ids", () => {
    const result = compareCommunitySellers(sellers, "nope", "also-nope");
    expect(result.both).toEqual([]);
    expect(result.onlyA).toEqual([]);
    expect(result.onlyB).toEqual([]);
    expect(result.overlapPercent).toBe(0);
  });

  it("does not treat unknown or former status as current recognition", () => {
    const result = compareCommunitySellers(sellers, "rwi", "repwatchforum");
    expect(result.both).toEqual([]);
    expect(result.onlyA.map((seller) => seller.sellerId)).toEqual(["jtime"]);
    expect(result.onlyB.map((seller) => seller.sellerId)).toEqual(["ddgtop"]);
  });
});

describe("filterSellers", () => {
  it("filters by community and recognition status", () => {
    expect(
      filterSellers(sellers, { communityId: "rwi" }).map((item) => item.sellerId),
    ).toEqual(["jtime", "ddgtop", "former-td"]);
    expect(
      filterSellers(sellers, { status: "provisionary_td" }).map(
        (item) => item.sellerId,
      ),
    ).toEqual(["ddgtop"]);
    expect(
      filterSellers(sellers, {
        communityId: "rwi",
        status: "trusted_seller",
      }).map((item) => item.sellerId),
    ).toEqual(["jtime"]);
  });

  it("ignores unknown status query values", () => {
    expect(parseRecognitionStatus("trusted")).toBeUndefined();
    expect(parseRecognitionStatus("full_td")).toBe("full_td");
  });
});
