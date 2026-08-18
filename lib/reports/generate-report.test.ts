import { describe, expect, it } from "vitest";

import { generateReport } from "./generate-report";
import type { ReportInput } from "./generate-report";
import { modelDossierSeedSchema, sellerSeedSchema } from "@/lib/knowledge/schemas";

const baseInput: ReportInput = {
  brand: "Tudor",
  model: "Black Bay 58",
  reference: "79030N",
  askingPrice: 2950,
  providedPhotoTypes: ["dial", "caseback", "bracelet"],
  imageQuality: "mixed",
  claimsFullSet: true,
};

const speedmasterDossier = modelDossierSeedSchema.parse({
  id: "cf-31030425001001",
  brand: "Omega",
  modelFamily: "Speedmaster",
  reference: "310.30.42.50.01.001",
  factory: "unknown",
  requiredPhotos: ["dial", "caseback", "movement"],
  riskCheckpoints: {
    dial: ["logo and subdial printing"],
    caseback: ["caseback markings"],
    movement: ["movement photo or independent inspection"],
  },
});

describe("generateReport", () => {
  it("keeps the default six-area checklist without a dossier", () => {
    const report = generateReport(baseInput);
    expect(report.overallRisk).toBe("medium");
    expect(report.photoCompleteness).toHaveLength(6);
    expect(report.visibleConcerns).toEqual([]);
    expect(report.sellerRiskSignals).toContain(
      "Listing claims a full set, but no box or papers are shown.",
    );
  });

  it("uses a model dossier required-photo set and checkpoint concerns", () => {
    const report = generateReport(
      {
        brand: "Omega",
        model: "Speedmaster",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback"],
      },
      { dossier: speedmasterDossier },
    );

    expect(report.photoCompleteness.map((item) => item.type)).toEqual([
      "dial",
      "caseback",
      "movement",
    ]);
    expect(report.overallRisk).toBe("medium");
    expect(report.visibleConcerns.map((item) => item.area)).toContain("Movement");
    expect(report.visibleConcerns[0]?.finding).toMatch(/cannot assess/i);
    expect(report.referenceConsistency).toMatch(/insufficient from curated notes/i);
  });

  it("does not invent pixel findings when checkpoint photos are present", () => {
    const report = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback", "movement"],
      },
      { dossier: speedmasterDossier },
    );
    expect(report.overallRisk).toBe("low");
    expect(report.visibleConcerns).toEqual([]);
  });

  it("adds seller product-claim flags and manual notes without vision", () => {
    const seller = sellerSeedSchema.parse({
      sellerId: "watchmaker88",
      canonicalName: "Watchmaker88",
      riskFlags: [
        {
          category: "product_claim",
          label: "medium",
          summary:
            "Historical skepticism around factory and product claims. Show this alongside later RWF vetting.",
        },
      ],
    });
    const report = generateReport(baseInput, {
      seller,
      manualNotes: ["Seller declined a clasp close-up in messages."],
    });
    expect(report.visibleConcerns.map((item) => item.area)).toEqual([
      "Seller product claim",
      "Buyer note",
    ]);
  });

  it("flags stock-photo language from listing text", () => {
    const report = generateReport({
      ...baseInput,
      listingText: "These are catalogue photos only. Actual watch may differ.",
    });
    expect(report.sellerRiskSignals).toContain(
      "Listing text mentions stock or catalogue photos.",
    );
  });
});
