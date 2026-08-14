import type { Metadata } from "next";
import Link from "next/link";

import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { PhotoUpload } from "@/components/photo-upload";

export const metadata: Metadata = {
  title: "Case photos | WatchTell",
  description:
    "Add listing photos and label the photo type. Files stay in the browser.",
};

export default function DraftPhotosPage() {
  return (
    <DashboardMain className="max-w-3xl">
      <PageTitle
        title="Add listing photos"
        subtitle="Label each shot so the review can tell what is present and what is missing. Files stay in this browser."
      />
      <Card className="p-5 sm:p-8">
        <PhotoUpload />
      </Card>
      <p className="mt-4 text-[13px] text-muted-foreground">
        <Link
          href="/cases/draft"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          Back to case
        </Link>
      </p>
    </DashboardMain>
  );
}
