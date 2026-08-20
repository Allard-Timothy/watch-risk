import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import { findForbiddenWords } from "@/lib/validation/safe-language";
import { compareCommunitySellers } from "./compare";
import {
  loadCommunities,
  loadCompareCases,
  loadFactories,
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
    const factories = await loadFactories();

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
    const submariner = dossiers.find((item) => item.reference === "126610LN");
    expect(submariner?.factoryVersion).toBe("vsf-current");
    expect(submariner?.caseSize).toBe("41mm");
    expect(submariner?.knownVariance.length).toBeGreaterThan(0);
    expect(submariner?.highValueChecks.length).toBeGreaterThan(0);
    expect(factories.map((item) => item.factoryId).sort()).toEqual([
      "unknown",
      "vsf",
    ]);
    const vsf = factories.find((item) => item.factoryId === "vsf");
    expect(vsf?.canonicalName).toBe("VSF");
    expect(vsf?.defects.some((item) => item.references.includes("126610LN"))).toBe(
      true,
    );

    for (const seller of sellers) {
      const text = [
        seller.interpretation,
        ...seller.likes,
        ...seller.concerns,
        ...seller.riskFlags.map((flag) => flag.summary),
      ]
        .filter(Boolean)
        .join(" ");
      expect(findForbiddenWords(text)).toEqual([]);
    }

    for (const factory of factories) {
      const text = [
        factory.notes,
        ...factory.versions.map((version) => version.notes),
        ...factory.defects.flatMap((defect) => [
          defect.whatBuyersShouldLookFor,
          defect.whatPhotosCannotShow,
        ]),
      ]
        .filter(Boolean)
        .join(" ");
      expect(findForbiddenWords(text)).toEqual([]);
    }

    for (const dossier of dossiers) {
      const text = [
        dossier.notes,
        dossier.movementFamily,
        ...dossier.knownVariance.flatMap((item) => [
          item.whatBuyersShouldLookFor,
          item.whatPhotosCannotShow,
        ]),
        ...dossier.highValueChecks.map((item) => item.sellerQuestion),
      ]
        .filter(Boolean)
        .join(" ");
      expect(findForbiddenWords(text)).toEqual([]);
    }
  });

  it("upserts the corpus into Postgres", async () => {
    const result = await seedKnowledge();
    expect(result.communities).toBeGreaterThanOrEqual(8);
    expect(result.sellers).toBeGreaterThanOrEqual(15);
    expect(result.factories).toBeGreaterThanOrEqual(2);

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

    const vsf = await getDbClient().factory.findUnique({
      where: { id: "vsf" },
      include: { versions: true, defects: true },
    });
    expect(vsf?.canonicalName).toBe("VSF");
    expect(vsf?.defects.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
