import type { ReportInput } from "./generate-report";

/**
 * Sample case input used to render the placeholder report page.
 *
 * This replaces the previous static report object: the report is now produced
 * by `generateReport(sampleReportInput)` so the deterministic rules are actually
 * exercised. This is still sample data only — nothing is persisted and no model
 * is called.
 */

export const sampleReportInput: ReportInput = {
  brand: "Tudor",
  model: "Black Bay 58",
  reference: "79030N",
  claimedYear: "2022",
  askingPrice: 2950,
  sellerPlatform: "Chrono24",
  providedPhotoTypes: ["dial", "caseback", "bracelet"],
  imageQuality: "mixed",
  claimsFullSet: true,
  stockPhotosOnly: false,
  sellerRefusedMorePhotos: false,
};

export const sampleReportMeta = {
  reportId: "WR-2026-0481",
  generatedAt: "June 7, 2026",
} as const;

export const SAMPLE_REPORT_PATH = `/reports/${sampleReportMeta.reportId}`;
