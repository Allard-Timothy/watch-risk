import { describe, expect, it } from "vitest";

import {
  fromPrismaEnum,
  toPrismaEnum,
} from "./enums";
import {
  recognitionStatusFromPrisma,
  sourceKindToPrisma,
} from "./persist";

describe("Prisma enum mapping", () => {
  it("uppercases on-the-wire values for Prisma storage", () => {
    expect(toPrismaEnum("cannot_assess")).toBe("CANNOT_ASSESS");
    expect(toPrismaEnum("provisionary_td")).toBe("PROVISIONARY_TD");
    expect(toPrismaEnum("complete")).toBe("COMPLETE");
    expect(toPrismaEnum("date_cyclops")).toBe("DATE_CYCLOPS");
  });

  it("lowercases Prisma values back to seed / report wire form", () => {
    expect(fromPrismaEnum("CANNOT_ASSESS")).toBe("cannot_assess");
    expect(fromPrismaEnum("PROVISIONARY_TD")).toBe("provisionary_td");
    expect(fromPrismaEnum("DATE_CYCLOPS")).toBe("date_cyclops");
  });

  it("round-trips persist helpers used when loading seller recognition", () => {
    expect(sourceKindToPrisma("manual_curation")).toBe("MANUAL_CURATION");
    expect(recognitionStatusFromPrisma("FULL_TD")).toBe("full_td");
    expect(recognitionStatusFromPrisma("UNKNOWN")).toBe("unknown");
  });
});
