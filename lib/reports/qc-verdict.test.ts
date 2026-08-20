import { describe, expect, it } from "vitest";

import { deriveQcVerdict } from "./qc-verdict";

describe("deriveQcVerdict", () => {
  it("returns insufficient evidence when too many photos are missing", () => {
    expect(
      deriveQcVerdict({
        overallRisk: "cannot_assess",
        missingEvidenceCount: 4,
        visibleConcerns: [],
      }),
    ).toBe("insufficient_evidence");
  });

  it("returns request additional evidence for partial photo sets", () => {
    expect(
      deriveQcVerdict({
        overallRisk: "medium",
        missingEvidenceCount: 2,
        visibleConcerns: [],
      }),
    ).toBe("request_additional_evidence");
  });

  it("returns gl when evidence is complete and risk is low", () => {
    expect(
      deriveQcVerdict({
        overallRisk: "low",
        missingEvidenceCount: 0,
        visibleConcerns: [],
      }),
    ).toBe("gl");
  });
});
