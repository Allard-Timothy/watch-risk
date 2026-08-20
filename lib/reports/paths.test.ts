import { describe, expect, it } from "vitest";

import { activeSavedCaseId, reportBasePath, reportPath } from "./paths";
import { SAMPLE_REPORT_PATH, sampleReportMeta } from "./sample-case";

describe("report paths", () => {
  it("treats a saved case route as the report id", () => {
    expect(activeSavedCaseId("/cases/cmssf6f5b0000js3vifvq0o35")).toBe(
      "cmssf6f5b0000js3vifvq0o35",
    );
    expect(reportBasePath("/cases/cmssf6f5b0000js3vifvq0o35")).toBe(
      reportPath("cmssf6f5b0000js3vifvq0o35"),
    );
  });

  it("keeps the sample report as the default", () => {
    expect(activeSavedCaseId("/")).toBeNull();
    expect(activeSavedCaseId("/cases/draft")).toBeNull();
    expect(activeSavedCaseId(`/reports/${sampleReportMeta.reportId}`)).toBeNull();
    expect(reportBasePath("/")).toBe(SAMPLE_REPORT_PATH);
  });

  it("treats a saved-case report route as the case id and ignores intake routes", () => {
    expect(activeSavedCaseId("/cases/new")).toBeNull();
    expect(activeSavedCaseId("/reports/cmssf6f5b0000js3vifvq0o35")).toBe(
      "cmssf6f5b0000js3vifvq0o35",
    );
    expect(reportBasePath("/reports/cmssf6f5b0000js3vifvq0o35")).toBe(
      reportPath("cmssf6f5b0000js3vifvq0o35"),
    );
  });
});
