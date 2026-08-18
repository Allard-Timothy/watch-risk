import Link from "next/link";

import { DashboardMain } from "@/components/dashboard-main";

export default function SellerNotFound() {
  return (
    <DashboardMain className="max-w-xl">
      <h1 className="font-serif text-3xl tracking-tight">Seller not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That seller id is not in the curated seed corpus.
      </p>
      <Link
        href="/sellers"
        className="mt-6 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background"
      >
        All sellers
      </Link>
    </DashboardMain>
  );
}
