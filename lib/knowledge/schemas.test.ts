import { describe, expect, it } from "vitest";

import { factorySeedSchema, modelDossierSeedSchema, sellerSeedSchema } from "./schemas";

const fixture = {
  sellerId: "ddgtop",
  canonicalName: "DDGTOP",
  status: "active" as const,
  aliases: [
    {
      alias: "DDG Top",
      identityConfidence: 0.95,
      evidenceNote: "Seller uses both spellings on listings.",
    },
  ],
  communities: [
    {
      communityId: "repwatchforum",
      status: "provisionary_td" as const,
      statusSince: "2026-01-01",
      moderatorVetted: true,
      formalTdProgram: true,
      sellerParticipationRequired: true,
      giveawayOrSponsorshipRelationship: true,
    },
    {
      communityId: "rwi",
      status: "unknown" as const,
    },
  ],
  trustDimensions: [
    { key: "overall" as const, label: "high" as const },
    { key: "legitimacy_confidence" as const, label: "high" as const },
    {
      key: "longevity" as const,
      label: "medium" as const,
      notes: "Shorter Western-facing history than old-line TDs.",
    },
    {
      key: "cross_community_validation" as const,
      label: "medium" as const,
    },
  ],
  riskFlags: [
    {
      category: "fraud" as const,
      label: "low" as const,
      summary: "No known non-delivery disputes in the curated notes.",
    },
  ],
  likes: [
    "Independent transaction reports outside RepWatchForum.",
    "Reports of catching issues before QC approval.",
  ],
  concerns: ["Shorter Western-facing history than old-line TDs."],
  interpretation:
    "DDGTOP lacks the decade-long Western forum history of older dealers, but independent transaction evidence across communities reduces the significance of missing RWI TD status. TD recognition is evidence, not a universal conclusion.",
  evidence: [
    {
      communityId: "repwatchforum",
      evidenceType: "td_listing" as const,
      independenceGroup: "rwf",
      claimText: "Listed as provisionary TD on RepWatchForum.",
      sentiment: "positive" as const,
      confidence: 0.7,
    },
    {
      communityId: "repwatchforum",
      evidenceType: "giveaway_or_sponsorship" as const,
      independenceGroup: "rwf",
      claimText: "Seller-sponsored giveaway on the same forum.",
      sentiment: "neutral" as const,
      confidence: 0.4,
    },
    {
      communityId: "1688time",
      evidenceType: "transaction_report" as const,
      independenceGroup: "1688time",
      claimText: "Independent buyer transaction reports on 1688Time.",
      sentiment: "positive" as const,
      confidence: 0.72,
    },
  ],
};

describe("sellerSeedSchema", () => {
  it("accepts a curated seller fixture", () => {
    const parsed = sellerSeedSchema.parse(fixture);
    expect(parsed.sellerId).toBe("ddgtop");
    expect(parsed.communities[0]?.status).toBe("provisionary_td");
    expect(parsed.aliases[0]?.alias).toBe("DDG Top");
  });

  it("rejects collapsing recognition into a boolean trusted field", () => {
    const result = sellerSeedSchema.safeParse({
      ...fixture,
      communities: [{ communityId: "rwi", status: "trusted" }],
    });
    expect(result.success).toBe(false);
  });

  it("does not treat a similar name as an automatic alias merge", () => {
    const parsed = sellerSeedSchema.parse({
      ...fixture,
      sellerId: "lin-seller",
      canonicalName: "Lin Seller",
      aliases: [],
    });
    expect(parsed.aliases).toEqual([]);
    expect(parsed.canonicalName).not.toMatch(/feng/i);
  });
});

describe("factorySeedSchema", () => {
  it("accepts qualitative known-defect notes", () => {
    const parsed = factorySeedSchema.parse({
      factoryId: "vsf",
      canonicalName: "VSF",
      versions: [{ id: "vsf-current", label: "Current curated notes" }],
      defects: [
        {
          id: "vsf-rehaut",
          area: "Rehaut",
          photoType: "rehaut",
          whatBuyersShouldLookFor: "A rehaut photo in even light.",
          whatPhotosCannotShow: "Etching depth after delivery.",
          references: ["126610LN"],
          factoryVersionId: "vsf-current",
        },
      ],
    });
    expect(parsed.defects[0]?.photoType).toBe("rehaut");
    expect(parsed.defects[0]?.references).toEqual(["126610LN"]);
  });
});

describe("modelDossierSeedSchema", () => {
  it("accepts known variance and high-value seller questions", () => {
    const parsed = modelDossierSeedSchema.parse({
      id: "vsf-126610ln",
      brand: "Rolex",
      modelFamily: "Submariner",
      reference: "126610LN",
      factory: "VSF",
      factoryVersion: "vsf-current",
      caseSize: "41mm",
      requiredPhotos: ["dial"],
      knownVariance: [
        {
          area: "Rehaut",
          photoType: "rehaut",
          whatBuyersShouldLookFor: "A rehaut photo in even light.",
          whatPhotosCannotShow: "Etching depth after delivery.",
        },
      ],
      highValueChecks: [
        {
          area: "Rehaut",
          photoType: "rehaut",
          sellerQuestion:
            "Can you send a rehaut photo so inner-ring etching can be discussed?",
        },
      ],
    });
    expect(parsed.factoryVersion).toBe("vsf-current");
    expect(parsed.caseSize).toBe("41mm");
    expect(parsed.knownVariance).toHaveLength(1);
    expect(parsed.highValueChecks[0]?.sellerQuestion).toMatch(/rehaut/i);
  });
});
