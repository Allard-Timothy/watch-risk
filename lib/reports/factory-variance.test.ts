import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  factorySeedSchema,
  modelDossierSeedSchema,
} from "@/lib/knowledge/schemas";
import { containsForbiddenLanguage } from "@/lib/validation";
import {
  CANNOT_ASSESS_FROM_IMAGES,
  buildFactoryVariance,
  concernsFromFactoryVariance,
  defectsForReference,
} from "./factory-variance";

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

describe("defectsForReference", () => {
  it("keeps only defects named for the listing reference", () => {
    const lv = defectsForReference(vsfFactory, "116610LV");
    const ln = defectsForReference(vsfFactory, "126610LN");
    expect(lv.every((defect) => defect.references.includes("116610LV"))).toBe(
      true,
    );
    expect(ln.every((defect) => defect.references.includes("126610LN"))).toBe(
      true,
    );
    expect(lv.map((defect) => defect.id)).not.toEqual(
      ln.map((defect) => defect.id),
    );
  });
});

describe("buildFactoryVariance", () => {
  it("omits the section when factory attribution is unknown", () => {
    const dossier = modelDossierSeedSchema.parse({
      id: "cf-31030425001001",
      brand: "Omega",
      modelFamily: "Speedmaster",
      reference: "310.30.42.50.01.001",
      factory: "unknown",
      requiredPhotos: ["dial"],
    });
    expect(
      buildFactoryVariance(["dial"], dossier, undefined, dossier.reference),
    ).toBeUndefined();
  });

  it("lists VSF variance without treating present photos as pixel findings", () => {
    const variance = buildFactoryVariance(
      ["dial", "rehaut", "clasp"],
      lvDossier,
      vsfFactory,
      "116610LV",
    );
    expect(variance?.factoryName).toBe("VSF");
    expect(variance?.items.length).toBeGreaterThan(0);
    expect(
      variance?.items.every((item) => item.assessment === "photo_present"),
    ).toBe(true);
    expect(concernsFromFactoryVariance(variance)).toEqual([]);
    expect(containsForbiddenLanguage(variance?.disclaimer ?? "")).toBe(false);
  });

  it("marks missing photos as cannot assess from submitted images", () => {
    const variance = buildFactoryVariance(
      ["dial"],
      lvDossier,
      vsfFactory,
      "116610LV",
    );
    const missing = variance?.items.filter(
      (item) => item.assessment === "cannot_assess",
    );
    expect(missing?.length).toBeGreaterThan(0);
    const concerns = concernsFromFactoryVariance(variance);
    expect(concerns.every((item) => item.finding === CANNOT_ASSESS_FROM_IMAGES)).toBe(
      true,
    );
    expect(
      concerns.every((item) => !containsForbiddenLanguage(item.finding)),
    ).toBe(true);
  });
});
