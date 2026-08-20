import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import { uniqueIndependenceGroups } from "./independence";
import { assertFactorySeed, upsertCommunity, upsertFactory, upsertSeller } from "./persist";
import { communitySeedSchema, factorySeedSchema, sellerSeedSchema } from "./schemas";

describe("seller knowledge persist", () => {
  it("round-trips a seller without treating RWF evidence as independent", async () => {
    const community = communitySeedSchema.parse({
      id: "repwatchforum",
      displayName: "RepWatchForum",
      independenceGroup: "rwf",
      formalTdProgram: true,
    });
    const time = communitySeedSchema.parse({
      id: "1688time",
      displayName: "1688Time",
      independenceGroup: "1688time",
      formalTdProgram: false,
    });
    await upsertCommunity(community);
    await upsertCommunity(time);

    const seed = sellerSeedSchema.parse({
      sellerId: "ddgtop-test",
      canonicalName: "DDGTOP",
      aliases: [{ alias: "DDG Top", identityConfidence: 0.95 }],
      communities: [
        {
          communityId: "repwatchforum",
          status: "provisionary_td",
          moderatorVetted: true,
          formalTdProgram: true,
        },
      ],
      trustDimensions: [{ key: "overall", label: "high" }],
      likes: ["Independent transaction reports outside RepWatchForum."],
      concerns: ["Shorter Western-facing history than old-line TDs."],
      interpretation:
        "Missing RWI TD status is not treated as a negative by itself.",
      evidence: [
        {
          communityId: "repwatchforum",
          evidenceType: "td_listing",
          independenceGroup: "rwf",
          claimText: "Provisionary TD listing",
        },
        {
          communityId: "repwatchforum",
          evidenceType: "moderator_review",
          independenceGroup: "rwf",
          claimText: "Moderator review",
        },
        {
          communityId: "1688time",
          evidenceType: "transaction_report",
          independenceGroup: "1688time",
          claimText: "Independent buyer report",
        },
      ],
    });

    const stored = await upsertSeller(seed);
    expect(stored?.canonicalName).toBe("DDGTOP");
    expect(stored?.communities[0]?.status).toBe("PROVISIONARY_TD");
    expect(stored?.aliases[0]?.alias).toBe("DDG Top");
    expect(uniqueIndependenceGroups(stored?.evidence ?? [])).toEqual([
      "rwf",
      "1688time",
    ]);

    await getDbClient().seller.delete({ where: { id: "ddgtop-test" } });
  });

  it("round-trips a factory and known-defect notes", async () => {
    const seed = factorySeedSchema.parse({
      factoryId: "vsf-test",
      canonicalName: "VSF",
      notes: "Curated test notes. A factory label is a claim, not a photo conclusion.",
      versions: [
        {
          id: "vsf-test-current",
          label: "Current curated notes",
        },
      ],
      defects: [
        {
          id: "vsf-test-rehaut",
          area: "Rehaut",
          photoType: "rehaut",
          whatBuyersShouldLookFor:
            "A rehaut photo so laser etching visibility can be discussed.",
          whatPhotosCannotShow:
            "Etching depth or how the ring looks off-camera.",
          references: ["126610LN"],
          factoryVersionId: "vsf-test-current",
        },
      ],
    });

    const stored = await upsertFactory(seed);
    expect(stored?.canonicalName).toBe("VSF");
    expect(stored?.versions).toHaveLength(1);
    expect(stored?.knownVariances[0]?.photoType).toBe("rehaut");
    expect(stored?.knownVariances[0]?.references).toEqual(["126610LN"]);

    await getDbClient().factory.delete({ where: { id: "vsf-test" } });
  });

  it("rejects a defect that points at an unknown factory version", () => {
    const seed = factorySeedSchema.parse({
      factoryId: "vsf-bad-version",
      canonicalName: "VSF",
      versions: [{ id: "vsf-current", label: "Current curated notes" }],
      defects: [
        {
          id: "vsf-bad-rehaut",
          area: "Rehaut",
          photoType: "rehaut",
          whatBuyersShouldLookFor: "A rehaut photo in even light.",
          whatPhotosCannotShow: "Etching depth after delivery.",
          factoryVersionId: "vsf-missing",
        },
      ],
    });

    expect(() => assertFactorySeed(seed)).toThrow(/unknown factory version/);
  });
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
