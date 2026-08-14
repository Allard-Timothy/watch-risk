import type { Metadata } from "next";

import { DashboardMain } from "@/components/dashboard-main";
import { ReportDashboard } from "@/components/report-dashboard";
import { generateReport } from "@/lib/reports/generate-report";
import { sampleReportInput } from "@/lib/reports/sample-case";

export const metadata: Metadata = {
  title: "Buyer-risk report | WatchTell",
  description:
    "Placeholder photo-based buyer-risk report built from deterministic rules and sample data.",
};

export default function ReportPage() {
  const report = generateReport(sampleReportInput);

  return (
    <DashboardMain>
      <ReportDashboard watch={sampleReportInput} report={report} />
    </DashboardMain>
  );
}
