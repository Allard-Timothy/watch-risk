import { describe, expect, it } from "vitest";

import { matchModelDossier, normalizeReference } from "./match-reference";
import { modelDossierSeedSchema } from "./schemas";

const dossiers = [
  modelDossierSeedSchema.parse({
    id: "vsf-126610ln",
    brand: "Rolex",
    modelFamily: "Submariner",
    reference: "126610LN",
    factory: "VSF",
    requiredPhotos: ["dial"],
  }),
  modelDossierSeedSchema.parse({
    id: "cf-31030425001001",
    brand: "Omega",
    modelFamily: "Speedmaster",
    reference: "310.30.42.50.01.001",
    requiredPhotos: ["dial", "caseback", "movement"],
  }),
];

describe("matchModelDossier", () => {
  it("ignores dots and case in references", () => {
    expect(normalizeReference("310.30.42.50.01.001")).toBe("31030425001001");
    expect(
      matchModelDossier(dossiers, "Omega", "31030425001001")?.id,
    ).toBe("cf-31030425001001");
    expect(matchModelDossier(dossiers, "Rolex", "126610ln")?.factory).toBe("VSF");
  });

  it("returns undefined when no reference is provided", () => {
    expect(matchModelDossier(dossiers, "Rolex")).toBeUndefined();
  });
});
