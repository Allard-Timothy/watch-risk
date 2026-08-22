import { describe, expect, it } from "vitest";

import {
  compareCommunitySellers,
  filterSellers,
  sellerRecognizedIn,
} from "./compare";
import { sellerSeedSchema } from "./schemas";

const statuses = {
  listed: sellerSeedSchema.parse({
    sellerId: "listed",
    canonicalName: "Listed",
    communities: [{ communityId: "reptime", status: "listed_seller" }],
  }),
  established: sellerSeedSchema.parse({
    sellerId: "established",
    canonicalName: "Established",
    communities: [{ communityId: "reptime", status: "established_seller" }],
  }),
  recommended: sellerSeedSchema.parse({
    sellerId: "recommended",
    canonicalName: "Recommended",
    communities: [{ communityId: "reptime", status: "recommended_seller" }],
  }),
  banned: sellerSeedSchema.parse({
    sellerId: "banned",
    canonicalName: "Banned",
    communities: [{ communityId: "reptime", status: "banned" }],
  }),
  removed: sellerSeedSchema.parse({
    sellerId: "removed",
    canonicalName: "Removed",
    communities: [{ communityId: "reptime", status: "removed_td" }],
  }),
};

describe("sellerRecognizedIn", () => {
  it("treats listed, established, and recommended as current recognition", () => {
    expect(sellerRecognizedIn(statuses.listed, "reptime")).toBe(true);
    expect(sellerRecognizedIn(statuses.established, "reptime")).toBe(true);
    expect(sellerRecognizedIn(statuses.recommended, "reptime")).toBe(true);
  });

  it("does not treat banned or removed TD as current recognition", () => {
    expect(sellerRecognizedIn(statuses.banned, "reptime")).toBe(false);
    expect(sellerRecognizedIn(statuses.removed, "reptime")).toBe(false);
  });

  it("keeps historical statuses out of compare overlap", () => {
    const result = compareCommunitySellers(
      Object.values(statuses),
      "reptime",
      "reptime",
    );
    expect(result.both.map((seller) => seller.sellerId).sort()).toEqual([
      "established",
      "listed",
      "recommended",
    ]);
    expect(result.overlapPercent).toBe(100);
  });

  it("can still filter the index by a historical status", () => {
    expect(
      filterSellers(Object.values(statuses), {
        communityId: "reptime",
        status: "banned",
      }).map((seller) => seller.sellerId),
    ).toEqual(["banned"]);
  });
});
