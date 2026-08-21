import { describe, expect, it } from "vitest";

import { recognitionsByIndependenceGroup } from "./independence";
import { sellerSeedSchema } from "./schemas";

describe("recognitionsByIndependenceGroup unknown communities", () => {
  it("uses the community id as the independence group and display name when the community is missing", () => {
    const seller = sellerSeedSchema.parse({
      sellerId: "orphan",
      canonicalName: "Orphan",
      communities: [{ communityId: "not-in-seed", status: "listed_seller" }],
    });

    const groups = recognitionsByIndependenceGroup(seller, []);
    expect(groups).toEqual([
      {
        independenceGroup: "not-in-seed",
        recognitions: [
          expect.objectContaining({
            communityId: "not-in-seed",
            displayName: "not-in-seed",
            status: "listed_seller",
          }),
        ],
      },
    ]);
  });
});
