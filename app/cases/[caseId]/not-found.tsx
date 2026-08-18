import Link from "next/link";

import { DashboardMain } from "@/components/dashboard-main";

export default function CaseNotFound() {
  return (
    <DashboardMain className="max-w-3xl">
      <h1 className="font-serif text-3xl tracking-tight">Case not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This case id is not in Postgres. Save a new case from intake, or open the
        sample draft for layout review.
      </p>
      <p className="mt-6 flex gap-4 text-sm">
        <Link href="/cases/new" className="font-medium underline-offset-2 hover:underline">
          Start a case
        </Link>
        <Link href="/cases/draft" className="font-medium underline-offset-2 hover:underline">
          Sample draft
        </Link>
      </p>
    </DashboardMain>
  );
}
