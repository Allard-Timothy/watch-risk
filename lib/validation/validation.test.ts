import { describe, expect, it } from "vitest";

import {
  SAFE_FALLBACK_REPORT,
  buyerRiskReportSchema,
  caseCreateFormSchema,
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
    missingEvidence: ["Straight-on dial photo"],
    visibleConcerns: [],
    sellerQuestions: ["Can you provide a dial photo in natural light?"],
    recommendedNextStep: "Request the missing photos before proceeding.",
    safeSummary: "The submitted photo set is incomplete.",
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

describe("buyerRiskReportSchema user-facing fields", () => {
  const safe = {
    overallRisk: "medium" as const,
    confidence: "low" as const,
    missingEvidence: ["Straight-on dial photo"],
    visibleConcerns: [],
    sellerQuestions: ["Can you provide a dial photo in natural light?"],
    recommendedNextStep: "Request the missing photos before proceeding.",
    safeSummary: "The submitted photo set is incomplete.",
  };

  it("rejects forbidden wording in seller questions, next steps, findings, and missing evidence", () => {
    expect(
      buyerRiskReportSchema.safeParse({
        ...safe,
        sellerQuestions: ["Is this authentic?"],
      }).success,
    ).toBe(false);
    expect(
      buyerRiskReportSchema.safeParse({
        ...safe,
        recommendedNextStep: "This listing passed inspection.",
      }).success,
    ).toBe(false);
    expect(
      buyerRiskReportSchema.safeParse({
        ...safe,
        visibleConcerns: [
          {
            area: "Dial",
            severity: "high",
            finding: "Looks counterfeit from the photos.",
            visibleEvidence: "Printing",
          },
        ],
      }).success,
    ).toBe(false);
    expect(
      buyerRiskReportSchema.safeParse({
        ...safe,
        missingEvidence: ["Certified papers photo"],
      }).success,
    ).toBe(false);
  });
});

describe("caseCreateFormSchema", () => {
  it("coerces asking price from a form string and drops blank optional fields", () => {
    const parsed = caseCreateFormSchema.safeParse({
      brand: " Rolex ",
      askingPrice: "4200",
      listingText: "  ",
      sellerHandle: "  JTime  ",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.brand).toBe("Rolex");
      expect(parsed.data.askingPrice).toBe(4200);
      expect(parsed.data.listingText).toBeUndefined();
      expect(parsed.data.sellerHandle).toBe("JTime");
    }
  });

  it("rejects a whitespace-only brand and a negative asking price", () => {
    expect(caseCreateFormSchema.safeParse({ brand: "   " }).success).toBe(
      false,
    );
    expect(
      caseCreateFormSchema.safeParse({
        brand: "Rolex",
        askingPrice: "-1",
      }).success,
    ).toBe(false);
  });
});
