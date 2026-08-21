import { describe, expect, it } from "vitest";

import { generateReport } from "./generate-report";
import type { ReportInput } from "./generate-report";
import {
  factorySeedSchema,
  modelDossierSeedSchema,
} from "@/lib/knowledge/schemas";
import {
  buildFactoryVariance,
  concernsFromFactoryVariance,
} from "./factory-variance";

const completeRecommendedTypes = [
  "dial",
  "caseback",
  "rehaut",
  "clasp",
  "bracelet",
  "movement",
] as const;

const completeInput: ReportInput = {
  brand: "Tudor",
  model: "Black Bay 58",
  reference: "79030N",
  askingPrice: 2950,
  providedPhotoTypes: completeRecommendedTypes,
  claimsFullSet: false,
};

describe("generateReport confidence and risk caps", () => {
  it("caps confidence at medium when there is no dial photo even if the dossier checklist is complete", () => {
    const dossier = modelDossierSeedSchema.parse({
      id: "caseback-only",
      brand: "Omega",
      modelFamily: "Speedmaster",
      reference: "310.30.42.50.01.001",
      requiredPhotos: ["caseback", "movement"],
    });
    const report = generateReport(
      {
        brand: "Omega",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["caseback", "movement"],
      },
      { dossier },
    );

    expect(report.overallRisk).toBe("low");
    expect(report.confidence).toBe("medium");
    expect(report.photoCompleteness.every((item) => item.present)).toBe(true);
  });

  it("caps confidence at medium for mixed image quality when the photo set is complete", () => {
    const report = generateReport({
      ...completeInput,
      imageQuality: "mixed",
    });
    expect(report.overallRisk).toBe("low");
    expect(report.confidence).toBe("medium");
  });

  it("keeps overall risk medium for three missing areas and cannot_assess at four", () => {
    const threeMissing = generateReport({
      ...completeInput,
      providedPhotoTypes: ["dial", "caseback", "bracelet"],
      imageQuality: undefined,
    });
    expect(threeMissing.overallRisk).toBe("medium");
    expect(threeMissing.confidence).toBe("low");

    const fourMissing = generateReport({
      ...completeInput,
      providedPhotoTypes: ["dial", "caseback"],
      imageQuality: undefined,
    });
    expect(fourMissing.overallRisk).toBe("cannot_assess");
    expect(fourMissing.confidence).toBe("low");
    expect(fourMissing.safeSummary).toMatch(/cannot be assessed/i);
  });
});

describe("generateReport seller questions", () => {
  it("asks for service history when the photo checklist is complete and there are no high-value checks", () => {
    const report = generateReport(completeInput);
    expect(report.sellerQuestions).toEqual([
      "Can you confirm the service history and provide any receipts?",
    ]);
  });

  it("asks for box and papers when a full-set claim has no papers photo", () => {
    const report = generateReport({
      ...completeInput,
      claimsFullSet: true,
    });
    expect(report.sellerQuestions).toContain(
      "Can you show the box and papers referenced in the listing?",
    );
    expect(report.sellerRiskSignals).toContain(
      "Listing claims a full set, but no box or papers are shown.",
    );
  });

  it("dedupes identical high-value seller questions", () => {
    const dossier = modelDossierSeedSchema.parse({
      id: "dup-checks",
      brand: "Omega",
      modelFamily: "Speedmaster",
      reference: "x",
      requiredPhotos: ["dial", "movement"],
      highValueChecks: [
        {
          area: "Movement",
          photoType: "movement",
          sellerQuestion: "Can you photograph the movement?",
        },
        {
          area: "Calibre",
          photoType: "movement",
          sellerQuestion: "Can you photograph the movement?",
        },
      ],
    });
    const report = generateReport(
      {
        brand: "Omega",
        askingPrice: 6400,
        providedPhotoTypes: ["dial"],
      },
      { dossier },
    );
    expect(
      report.sellerQuestions.filter(
        (question) => question === "Can you photograph the movement?",
      ),
    ).toHaveLength(1);
  });
});

describe("generateReport factory attribution copy", () => {
  it("mentions curated factory attribution when the dossier names a factory", () => {
    const dossier = modelDossierSeedSchema.parse({
      id: "vsf-116610lv",
      brand: "Rolex",
      modelFamily: "Submariner",
      reference: "116610LV",
      factory: "VSF",
      requiredPhotos: ["dial"],
    });
    const report = generateReport(
      {
        brand: "Rolex",
        reference: "116610LV",
        askingPrice: 4200,
        providedPhotoTypes: ["dial"],
      },
      { dossier },
    );
    expect(report.referenceConsistency).toMatch(/factory attribution VSF/i);
  });
});

describe("factory variance without a matching factory seed", () => {
  const namedDossier = modelDossierSeedSchema.parse({
    id: "vsf-116610lv",
    brand: "Rolex",
    modelFamily: "Submariner",
    reference: "116610LV",
    factory: "VSF",
    requiredPhotos: ["dial", "rehaut"],
    riskCheckpoints: {
      dial: ["date centering"],
      rehaut: ["rehaut alignment"],
    },
  });

  it("still lists known variance from dossier checkpoints when no factory seed is passed", () => {
    const variance = buildFactoryVariance(
      ["dial"],
      namedDossier,
      undefined,
      "116610LV",
    );
    expect(variance?.factoryId).toBe("VSF");
    expect(variance?.factoryName).toBe("VSF");
    expect(variance?.items.map((item) => item.lookFor)).toEqual([
      "date centering",
      "rehaut alignment",
    ]);
    expect(
      variance?.items.find((item) => item.lookFor === "rehaut alignment")
        ?.assessment,
    ).toBe("cannot_assess");
    expect(concernsFromFactoryVariance(variance)).toHaveLength(1);
  });

  it("uses the dossier factory label when the seed row is the unknown factory", () => {
    const unknownFactory = factorySeedSchema.parse({
      factoryId: "unknown",
      canonicalName: "Unknown",
      defects: [],
    });
    const variance = buildFactoryVariance(
      ["dial", "rehaut"],
      namedDossier,
      unknownFactory,
      "116610LV",
    );
    expect(variance?.factoryName).toBe("VSF");
    expect(
      variance?.items.every((item) => item.assessment === "photo_present"),
    ).toBe(true);
    expect(concernsFromFactoryVariance(variance)).toEqual([]);
  });

  it("does not treat a non-assessable defect photo type as a missing-photo concern", () => {
    const factory = factorySeedSchema.parse({
      factoryId: "vsf",
      canonicalName: "VSF",
      defects: [
        {
          id: "bezel-feel",
          area: "Bezel",
          photoType: "bezel",
          whatBuyersShouldLookFor: "Ask how the bezel clicks after a week.",
          whatPhotosCannotShow: "Bezel action cannot be judged from stills.",
          references: ["116610LV"],
        },
      ],
    });
    const variance = buildFactoryVariance(
      ["dial"],
      namedDossier,
      factory,
      "116610LV",
    );
    expect(variance?.items).toEqual([
      expect.objectContaining({
        id: "bezel-feel",
        photoType: undefined,
        assessment: "not_tied_to_photo",
      }),
    ]);
    expect(concernsFromFactoryVariance(variance)).toEqual([]);
  });
});
