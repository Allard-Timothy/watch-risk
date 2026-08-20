import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

import { generateReport } from "./generate-report";
import type { ReportInput } from "./generate-report";
import {
  factorySeedSchema,
  modelDossierSeedSchema,
  sellerSeedSchema,
} from "@/lib/knowledge/schemas";
import { CANNOT_ASSESS_FROM_IMAGES } from "./factory-variance";
import { containsForbiddenLanguage } from "@/lib/validation";

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

  it("does not show known factory variance for an unknown factory", () => {
    const report = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback"],
      },
      { dossier: speedmasterDossier },
    );
    expect(report.factoryVariance).toBeUndefined();
    expect(report.visibleConcerns.map((item) => item.finding)).toEqual([
      CANNOT_ASSESS_FROM_IMAGES,
    ]);
  });
});

const vsfFactory = factorySeedSchema.parse(
  JSON.parse(
    readFileSync(
      path.join(process.cwd(), "data/knowledge/factories/vsf.json"),
      "utf8",
    ),
  ),
);

const lvDossier = modelDossierSeedSchema.parse({
  id: "vsf-116610lv",
  brand: "Rolex",
  modelFamily: "Submariner",
  reference: "116610LV",
  factory: "VSF",
  requiredPhotos: ["dial", "rehaut", "date_cyclops", "clasp"],
  riskCheckpoints: {
    dial: ["date centering"],
    rehaut: ["rehaut alignment"],
    clasp: ["SEL fit"],
  },
});

describe("generateReport factory variance", () => {
  it("lists known factory variance without inventing pixel findings", () => {
    const report = generateReport(
      {
        brand: "Rolex",
        model: "Submariner",
        reference: "116610LV",
        askingPrice: 4200,
        providedPhotoTypes: ["dial", "rehaut", "date_cyclops", "clasp"],
      },
      { dossier: lvDossier, factory: vsfFactory },
    );
    expect(report.factoryVariance?.factoryName).toBe("VSF");
    expect(report.visibleConcerns).toEqual([]);
    expect(
      report.factoryVariance?.items.every(
        (item) => item.assessment === "photo_present",
      ),
    ).toBe(true);
    expect(
      containsForbiddenLanguage(report.factoryVariance?.disclaimer ?? ""),
    ).toBe(false);
  });

  it("adds visibleConcerns only when the relevant factory-variance photo is missing", () => {
    const report = generateReport(
      {
        brand: "Rolex",
        reference: "116610LV",
        askingPrice: 4200,
        providedPhotoTypes: ["dial"],
      },
      { dossier: lvDossier, factory: vsfFactory },
    );
    expect(report.factoryVariance).toBeDefined();
    expect(
      report.visibleConcerns.every(
        (item) => item.finding === CANNOT_ASSESS_FROM_IMAGES,
      ),
    ).toBe(true);
    expect(report.visibleConcerns.map((item) => item.area)).not.toContain(
      "Dial date centering",
    );
    expect(report.visibleConcerns.length).toBeGreaterThan(0);
    expect(
      report.visibleConcerns.every(
        (item) => !containsForbiddenLanguage(item.finding),
      ),
    ).toBe(true);
  });
});

describe("generateReport high-value checks", () => {
  it("uses dossier highValueChecks for seller questions", () => {
    const dossier = modelDossierSeedSchema.parse({
      ...speedmasterDossier,
      highValueChecks: [
        {
          area: "Movement",
          photoType: "movement",
          sellerQuestion:
            "Can you photograph the movement through the exhibition caseback, or allow an independent inspection?",
        },
        {
          area: "Timekeeping",
          sellerQuestion:
            "Can you share a timegrapher reading, or allow an independent inspection before purchase?",
        },
      ],
    });

    const missingMovement = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback"],
      },
      { dossier },
    );
    expect(missingMovement.sellerQuestions).toEqual(
      expect.arrayContaining([
        "Can you photograph the movement through the exhibition caseback, or allow an independent inspection?",
        "Can you share a timegrapher reading, or allow an independent inspection before purchase?",
      ]),
    );
    expect(missingMovement.sellerQuestions).not.toContain(
      "Can you provide a movement photo, or allow an independent inspection?",
    );

    const completePhotos = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback", "movement"],
      },
      { dossier },
    );
    expect(completePhotos.sellerQuestions).toEqual(
      expect.arrayContaining([
        "Can you photograph the movement through the exhibition caseback, or allow an independent inspection?",
        "Can you share a timegrapher reading, or allow an independent inspection before purchase?",
      ]),
    );
    expect(completePhotos.sellerQuestions).not.toContain(
      "Can you confirm the service history and provide any receipts?",
    );
  });
});
