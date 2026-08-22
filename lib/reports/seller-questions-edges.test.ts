import { describe, expect, it } from "vitest";

import { modelDossierSeedSchema } from "@/lib/knowledge/schemas";
import { SAFE_FALLBACK_REPORT } from "@/lib/validation";

import { generateReport } from "./generate-report";

const speedmaster = modelDossierSeedSchema.parse({
  id: "cf-31030425001001",
  brand: "Omega",
  modelFamily: "Speedmaster",
  reference: "310.30.42.50.01.001",
  factory: "unknown",
  requiredPhotos: ["dial", "caseback", "movement"],
  highValueChecks: [
    {
      area: "Movement",
      photoType: "movement",
      sellerQuestion:
        "Can you send a movement photo, or confirm that an independent inspection is available before purchase?",
    },
    {
      area: "Timekeeping",
      sellerQuestion:
        "Can you share a timegrapher reading, or allow an independent inspection before purchase?",
    },
  ],
});

describe("generateReport seller-question edges", () => {
  it("does not ask for box and papers when a full-set claim already includes a papers photo", () => {
    const report = generateReport({
      brand: "Omega",
      reference: "310.30.42.50.01.001",
      askingPrice: 6400,
      providedPhotoTypes: ["dial", "caseback", "movement", "papers"],
      claimsFullSet: true,
    });

    expect(report.sellerQuestions).not.toContain(
      "Can you show the box and papers referenced in the listing?",
    );
    expect(report.sellerRiskSignals).not.toContain(
      "Listing claims a full set, but no box or papers are shown.",
    );
  });

  it("falls back to the safe report when a high-value question uses forbidden wording", () => {
    const dossier = modelDossierSeedSchema.parse({
      ...speedmaster,
      highValueChecks: [
        {
          area: "Dial",
          photoType: "dial",
          sellerQuestion: "Can you confirm this watch is authentic?",
        },
      ],
    });

    const report = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback", "movement"],
      },
      { dossier },
    );

    expect(report.overallRisk).toBe(SAFE_FALLBACK_REPORT.overallRisk);
    expect(report.safeSummary).toBe(SAFE_FALLBACK_REPORT.safeSummary);
    expect(report.sellerQuestions).toEqual([]);
  });
});
