import { describe, expect, it } from "vitest";

import {
  evidenceByIndependenceGroup,
  recencyBucket,
  uniqueIndependenceGroups,
} from "./independence";
import type { EvidenceSeed } from "./schemas";

const evidence: EvidenceSeed[] = [
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
    claimText: "Moderator review on the same forum",
  },
  {
    communityId: "repwatchforum",
    evidenceType: "giveaway_or_sponsorship",
    independenceGroup: "rwf",
    claimText: "Seller giveaway",
  },
  {
    communityId: "1688time",
    evidenceType: "transaction_report",
    independenceGroup: "1688time",
    claimText: "Independent buyer report",
  },
];

describe("independence grouping", () => {
  it("counts one RWF ecosystem rather than three confirmations", () => {
    expect(uniqueIndependenceGroups(evidence)).toEqual(["rwf", "1688time"]);
    expect(evidenceByIndependenceGroup(evidence).get("rwf")).toHaveLength(3);
  });
});

describe("recencyBucket", () => {
  const now = new Date("2026-08-18T00:00:00.000Z");

  it("weights recent evidence more highly", () => {
    expect(recencyBucket("2026-06-01", now)).toBe("very_high");
    expect(recencyBucket("2025-10-01", now)).toBe("high");
    expect(recencyBucket("2024-09-01", now)).toBe("medium");
    expect(recencyBucket("2023-01-01", now)).toBe("lower");
    expect(recencyBucket("2018-01-01", now)).toBe("historical");
  });
});
