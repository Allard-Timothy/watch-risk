import { describe, expect, it } from "vitest";

import {
  CLAIMED_PHOTO_TYPES,
  claimedTypeToPrisma,
  prismaToClaimedType,
} from "@/lib/photos";

describe("claimed photo type persistence", () => {
  it("round-trips every intake label through the Prisma PhotoType enum", () => {
    for (const type of CLAIMED_PHOTO_TYPES) {
      expect(prismaToClaimedType(claimedTypeToPrisma(type))).toBe(type);
    }
  });

  it("treats an unlabeled Prisma null as an empty claimed type", () => {
    expect(prismaToClaimedType(null)).toBe("");
  });
});
