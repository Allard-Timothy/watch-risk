import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import { uniqueIndependenceGroups } from "./independence";
import { upsertCommunity, upsertSeller } from "./persist";
import { communitySeedSchema, sellerSeedSchema } from "./schemas";

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
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
