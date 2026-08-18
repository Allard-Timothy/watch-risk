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
});
