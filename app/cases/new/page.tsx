import type { Metadata } from "next";

import { CaseForm } from "@/components/case-form";
import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";

export const metadata: Metadata = {
  title: "New case | WatchTell",
  description:
    "Record a luxury watch listing to start a photo-based buyer-risk review.",
};

export default function NewCasePage() {
  return (
    <DashboardMain className="max-w-3xl">
      <PageTitle
        title="Start a buyer-risk case"
        subtitle="Add what the listing states about the watch. Only the brand is required now."
      />
      <Card className="p-5 sm:p-8">
        <CaseForm />
      </Card>
    </DashboardMain>
  );
}
