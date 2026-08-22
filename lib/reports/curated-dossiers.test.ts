import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  factorySeedSchema,
  modelDossierSeedSchema,
} from "@/lib/knowledge/schemas";
import { containsForbiddenLanguage } from "@/lib/validation";

import { generateReport } from "./generate-report";

function readJson(relativePath: string): unknown {
  return JSON.parse(
    readFileSync(path.join(process.cwd(), relativePath), "utf8"),
  );
}

const lvDossier = modelDossierSeedSchema.parse(
  readJson("data/knowledge/references/vsf-116610lv.json"),
);
const speedmaster = modelDossierSeedSchema.parse(
  readJson("data/knowledge/references/omega-31030425001001.json"),
);
const vsfFactory = factorySeedSchema.parse(
  readJson("data/knowledge/factories/vsf.json"),
);

function userFacingText(report: ReturnType<typeof generateReport>): string {
  return [
    report.safeSummary,
    report.recommendedNextStep,
    report.referenceConsistency,
    ...report.missingEvidence,
    ...report.sellerQuestions,
    ...report.sellerRiskSignals,
    ...report.visibleConcerns.flatMap((item) => [
      item.finding,
      item.visibleEvidence,
    ]),
    report.factoryVariance?.disclaimer,
    ...(report.factoryVariance?.items.flatMap((item) => [
      item.lookFor,
      item.photosCannotShow,
    ]) ?? []),
  ]
    .filter(Boolean)
    .join("\n");
}

describe("generateReport with curated dossiers", () => {
  it("asks the VSF 116610LV high-value questions and lists factory variance", () => {
    const report = generateReport(
      {
        brand: "Rolex",
        model: "Submariner",
        reference: "116610LV",
        askingPrice: 4200,
        providedPhotoTypes: ["dial"],
      },
      { dossier: lvDossier, factory: vsfFactory },
    );

    expect(report.factoryVariance?.factoryName).toBe("VSF");
    expect(report.sellerQuestions).toEqual(
      expect.arrayContaining(
        lvDossier.highValueChecks.map((check) => check.sellerQuestion),
      ),
    );
    expect(report.sellerQuestions).not.toContain(
      "Can you photograph the rehaut / inner bezel ring?",
    );
    expect(containsForbiddenLanguage(userFacingText(report))).toBe(false);
  });

  it("does not invent factory variance for the unknown-factory Speedmaster dossier", () => {
    const report = generateReport(
      {
        brand: "Omega",
        model: "Speedmaster",
        reference: "310.30.42.50.01.001",
        askingPrice: 6400,
        providedPhotoTypes: ["dial", "caseback"],
      },
      { dossier: speedmaster },
    );

    expect(report.factoryVariance).toBeUndefined();
    expect(report.sellerQuestions).toContain(
      "Can you send a movement photo, or confirm that an independent inspection is available before purchase?",
    );
    expect(report.referenceConsistency).toMatch(
      /insufficient from curated notes/i,
    );
    expect(containsForbiddenLanguage(userFacingText(report))).toBe(false);
  });
});
