import { SAMPLE_REPORT_PATH, sampleReportMeta } from "@/lib/reports/sample-case";

export function reportPath(reportId: string): string {
  return `/reports/${reportId}`;
}

/** Case id when the current route is a saved case or that case's report. */
export function activeSavedCaseId(pathname: string): string | null {
  const caseMatch = pathname.match(/^\/cases\/([^/]+)/);
  if (caseMatch) {
    const caseId = caseMatch[1];
    if (caseId && caseId !== "draft" && caseId !== "new") {
      return caseId;
    }
  }

  const reportMatch = pathname.match(/^\/reports\/([^/]+)/);
  if (reportMatch) {
    const reportId = reportMatch[1];
    if (reportId && reportId !== sampleReportMeta.reportId) {
      return reportId;
    }
  }

  return null;
}

export function reportBasePath(pathname: string): string {
  const caseId = activeSavedCaseId(pathname);
  return caseId ? reportPath(caseId) : SAMPLE_REPORT_PATH;
}
