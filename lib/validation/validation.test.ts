import { describe, expect, it } from "vitest";

import {
  SAFE_FALLBACK_REPORT,
  buyerRiskReportSchema,
  caseCreateSchema,
  containsForbiddenLanguage,
  findForbiddenWords,
} from "@/lib/validation";

describe("findForbiddenWords", () => {
  it("flags authentic as a whole word", () => {
    expect(findForbiddenWords("this looks authentic")).toEqual(["authentic"]);
  });

  it("does not flag authentication", () => {
    expect(
      findForbiddenWords("independent authentication is recommended"),
    ).toEqual([]);
  });

  it("is case-insensitive", () => {
    expect(findForbiddenWords("Verified listing")).toEqual(["verified"]);
  });
});

describe("containsForbiddenLanguage", () => {
  it("returns false for safe copy", () => {
    expect(
      containsForbiddenLanguage("independent inspection recommended"),
    ).toBe(false);
  });

  it("returns true for forbidden conclusion words", () => {
    expect(containsForbiddenLanguage("guaranteed genuine")).toBe(true);
  });
});

describe("buyerRiskReportSchema", () => {
  const safe = {
    overallRisk: "medium" as const,
    confidence: "low" as const,
    qcVerdict: "request_additional_evidence" as const,
    missingEvidence: ["Straight-on dial photo"],
    visibleConcerns: [],
    sellerQuestions: ["Can you provide a dial photo in natural light?"],
    recommendedNextStep: "Request the missing photos before proceeding.",
    safeSummary: "The submitted photo set is incomplete.",
    provenanceCitations: [],
  };

  it("accepts a safe report", () => {
    expect(buyerRiskReportSchema.safeParse(safe).success).toBe(true);
  });

  it("accepts SAFE_FALLBACK_REPORT", () => {
    expect(buyerRiskReportSchema.safeParse(SAFE_FALLBACK_REPORT).success).toBe(
      true,
    );
  });

  it("rejects forbidden wording in safeSummary", () => {
    const parsed = buyerRiskReportSchema.safeParse({
      ...safe,
      safeSummary: "This watch is authentic and guaranteed genuine.",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("caseCreateSchema", () => {
  it("requires brand", () => {
    expect(caseCreateSchema.safeParse({}).success).toBe(false);
  });

  it("parses a valid case", () => {
    const parsed = caseCreateSchema.safeParse({
      brand: "Tudor",
      listingUrl: "https://example.com/listing",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid listing URL", () => {
    expect(
      caseCreateSchema.safeParse({ brand: "Rolex", listingUrl: "not-a-url" })
        .success,
    ).toBe(false);
  });
});
