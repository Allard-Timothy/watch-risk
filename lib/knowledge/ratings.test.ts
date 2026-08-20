import { describe, expect, it } from "vitest";

import { computeSellerRatings } from "./ratings";
import { sellerSeedSchema } from "./schemas";

describe("computeSellerRatings", () => {
  it("returns qualitative bands without numeric scores", () => {
    const seller = sellerSeedSchema.parse({
      sellerId: "jtime",
      canonicalName: "JTime",
      trustDimensions: [
        { key: "overall", label: "high" },
        { key: "fulfillment_confidence", label: "high" },
        { key: "qc_process_quality", label: "medium" },
      ],
      evidence: [
        {
          evidenceType: "td_listing",
          independenceGroup: "rwi",
          claimText: "RWI TD listing.",
        },
        {
          evidenceType: "td_listing",
          independenceGroup: "repgeek",
          claimText: "RepGeek TD listing.",
        },
      ],
    });

    const ratings = computeSellerRatings(seller);
    expect(ratings).toHaveLength(3);
    expect(ratings.every((item) => typeof item.label === "string")).toBe(true);
    expect(ratings[0]?.basis).toMatch(/independent evidence group/);
  });
});
