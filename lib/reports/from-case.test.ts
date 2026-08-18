import { describe, expect, it } from "vitest";

import { reportInputFromCase } from "./from-case";
import { generateReport } from "./generate-report";
import type { PersistedWatchCase } from "@/lib/cases/repository";

const listing: PersistedWatchCase = {
  id: "case_test_1",
  brand: "Omega",
  model: "Speedmaster",
  reference: "310.30.42.50.01.001",
  claimedYear: "2021",
  askingPrice: 6400,
  sellerPlatform: "Chrono24",
  listingText: undefined,
  sellerClaims: undefined,
  createdAt: new Date("2026-08-14T00:00:00.000Z"),
  photos: [],
};

describe("reportInputFromCase", () => {
  it("copies listing fields and starts with no photo areas", () => {
    const input = reportInputFromCase(listing);
    expect(input.brand).toBe("Omega");
    expect(input.model).toBe("Speedmaster");
    expect(input.askingPrice).toBe(6400);
    expect(input.providedPhotoTypes).toEqual([]);
  });

  it("passes labeled recommended types into the generator", () => {
    const input = reportInputFromCase(listing, ["dial", "caseback", "bracelet"]);
    expect(input.providedPhotoTypes).toEqual(["dial", "caseback", "bracelet"]);

    const report = generateReport(input);
    expect(report.overallRisk).toBe("medium");
    expect(report.photoCompleteness.filter((item) => item.present)).toHaveLength(
      3,
    );
  });

  it("ignores unlabeled and non-recommended claimed types", () => {
    const input = reportInputFromCase(listing, ["", "bezel", "dial"]);
    expect(input.providedPhotoTypes).toEqual(["dial"]);
  });

  it("reads labeled types from persisted photos when none are passed", () => {
    const withPhotos: PersistedWatchCase = {
      ...listing,
      photos: [
        {
          id: "img_1",
          fileName: "dial.jpg",
          url: "/api/cases/case_test_1/images/img_1",
          claimedType: "dial",
          storagePath: "case_test_1/img_1-dial.jpg",
        },
        {
          id: "img_2",
          fileName: "bezel.jpg",
          url: "/api/cases/case_test_1/images/img_2",
          claimedType: "bezel",
          storagePath: "case_test_1/img_2-bezel.jpg",
        },
      ],
    };

    expect(reportInputFromCase(withPhotos).providedPhotoTypes).toEqual(["dial"]);
  });
});
