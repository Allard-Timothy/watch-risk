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

  it("returns every factory defect when no listing reference is supplied", () => {
    const all = defectsForReference(vsfFactory);
    expect(all).toHaveLength(vsfFactory.defects.length);
  });

  it("normalizes reference punctuation when filtering defects", () => {
    const dotted = defectsForReference(vsfFactory, "116-610 lv");
    expect(dotted.length).toBeGreaterThan(0);
    expect(
      dotted.every((defect) => defect.references.includes("116610LV")),
    ).toBe(true);
    expect(
      dotted.some((defect) => defect.references.includes("126610LN")),
    ).toBe(false);
  });

  it("falls back to dossier checkpoints when the factory has no defects for the reference", () => {
    const emptyFactory = factorySeedSchema.parse({
      factoryId: "vsf",
      canonicalName: "VSF",
      defects: [],
    });
    const variance = buildFactoryVariance(
      ["dial"],
      lvDossier,
      emptyFactory,
      "116610LV",
    );
    expect(variance?.items.map((item) => item.lookFor)).toEqual([
      "date centering",
      "rehaut alignment",
      "SEL fit",
    ]);
    expect(
      variance?.items.find((item) => item.lookFor === "date centering")
        ?.assessment,
    ).toBe("photo_present");
    expect(
      variance?.items.find((item) => item.lookFor === "rehaut alignment")
        ?.assessment,
    ).toBe("cannot_assess");
  });

  it("does not turn variance without a photo type into visible concerns", () => {
    const factory = factorySeedSchema.parse({
      factoryId: "vsf",
      canonicalName: "VSF",
      defects: [
        {
          id: "on-wrist-feel",
          area: "On-wrist feel",
          whatBuyersShouldLookFor:
            "Ask how the bracelet sits after a week of wear.",
          whatPhotosCannotShow:
            "Wrist feel cannot be judged from listing photos.",
          references: ["116610LV"],
        },
      ],
    });
    const variance = buildFactoryVariance(
      ["dial"],
      lvDossier,
      factory,
      "116610LV",
    );
    expect(variance?.items).toEqual([
      expect.objectContaining({
        id: "on-wrist-feel",
        assessment: "not_tied_to_photo",
      }),
    ]);
    expect(concernsFromFactoryVariance(variance)).toEqual([]);
  });
});
