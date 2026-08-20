import { describe, expect, it } from "vitest";

import {
  providedDetectedTypes,
  recommendedPhotoAreasFor,
} from "@/lib/photos";

describe("recommendedPhotoAreasFor", () => {
  it("returns the default six-area checklist when required types are missing or unusable", () => {
    const fallback = recommendedPhotoAreasFor().map((item) => item.type);
    expect(fallback).toEqual([
      "dial",
      "caseback",
      "rehaut",
      "clasp",
      "bracelet",
      "movement",
    ]);
    expect(
      recommendedPhotoAreasFor(["bezel", "other", "crown_guards"]).map(
        (item) => item.type,
      ),
    ).toEqual(fallback);
  });

  it("keeps dossier photo types that the generator can assess", () => {
    expect(
      recommendedPhotoAreasFor(["dial", "rehaut", "date_cyclops"]).map(
        (item) => item.type,
      ),
    ).toEqual(["dial", "rehaut", "date_cyclops"]);
  });
});

describe("providedDetectedTypes", () => {
  it("drops unlabeled, duplicate, and non-detected claimed types", () => {
    expect(
      providedDetectedTypes(["", "bezel", "dial", "dial", "crown_guards"]),
    ).toEqual(["dial"]);
  });
});
