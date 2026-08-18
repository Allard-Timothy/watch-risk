import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import { compareCommunitySellers } from "./compare";
import {
  loadCommunities,
  loadCompareCases,
  loadModelDossiers,
  loadSellers,
  seedKnowledge,
} from "./load";

describe("knowledge seed corpus", () => {
  it("validates communities, sellers, compare cases, and reference dossiers", async () => {
    const communities = await loadCommunities();
    const sellers = await loadSellers();
    const compareCases = await loadCompareCases();
    const dossiers = await loadModelDossiers();

    expect(communities.map((item) => item.id)).toContain("repwatchforum");
    expect(sellers.map((item) => item.sellerId)).toEqual(
      expect.arrayContaining(["ddgtop", "lin-seller", "jtime", "puretime"]),
    );
    const lin = sellers.find((item) => item.sellerId === "lin-seller");
    expect(lin?.aliases).toEqual([]);
    expect(lin?.canonicalName).not.toMatch(/feng/i);

    const compare = compareCommunitySellers(
      sellers,
      "reptime",
      "repwatchforum",
    );
    expect(compare.overlapPercent).toBeLessThan(50);
    expect(compareCases[0]?.id).toBe("reptime-vs-repwatchforum");
    expect(dossiers.some((item) => item.reference === "126610LN")).toBe(true);
  });

  it("upserts the corpus into Postgres", async () => {
    const result = await seedKnowledge();
    expect(result.communities).toBeGreaterThanOrEqual(8);
    expect(result.sellers).toBeGreaterThanOrEqual(15);

    const stored = await getDbClient().seller.findUnique({
      where: { id: "ddgtop" },
      include: { communities: true, evidence: true },
    });
    expect(stored?.canonicalName).toBe("DDGTOP");
    expect(
      stored?.communities.some(
        (row) => row.status === "PROVISIONARY_TD",
      ),
    ).toBe(true);
  });
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
