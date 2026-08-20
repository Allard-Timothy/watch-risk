import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { checkoutAction, getAccountSummary } from "@/lib/billing/actions";
import { logoutAction } from "@/lib/auth/actions";
import { SKUS } from "@/lib/billing/skus";

type AccountPageProps = Readonly<{
  searchParams: Promise<{ checkout?: string }>;
}>;

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const summary = await getAccountSummary();
  if (!summary) {
    redirect("/login");
  }
  const params = await searchParams;

  return (
    <DashboardMain>
      <PageTitle
        kicker="Account"
        title={summary.user.email ?? "Your account"}
        subtitle="Saved cases, report credits, and subscription status."
      />

      {params.checkout === "success" ? (
        <p className="mb-4 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-[13px] text-accent">
          Checkout completed. Credits or subscription access should now be active.
        </p>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Report credits
          </p>
          <p className="mt-1 text-2xl font-semibold">{summary.balance}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Subscription
          </p>
          <p className="mt-1 text-[15px] font-semibold">
            {summary.subscription?.status === "ACTIVE" ? "Active" : "None"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Saved cases
          </p>
          <p className="mt-1 text-2xl font-semibold">{summary.cases.length}</p>
        </Card>
      </div>

      <Card className="mb-6 p-6">
        <h2 className="font-serif text-xl">Buy credits</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {SKUS.map((sku) => (
            <li key={sku.id} className="rounded-lg border border-border p-4">
              <p className="font-semibold">{sku.name}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {sku.description}
              </p>
              <p className="mt-2 text-[13px] font-medium">
                ${(sku.priceCents / 100).toFixed(2)}
              </p>
              <form action={checkoutAction} className="mt-3">
                <input type="hidden" name="sku" value={sku.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-foreground px-3 py-1.5 text-[12px] font-semibold text-background"
                >
                  Checkout (mock)
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="font-serif text-xl">Your cases</h2>
        {summary.cases.length === 0 ? (
          <p className="mt-3 text-[13px] text-muted-foreground">
            No saved cases yet.{" "}
            <Link href="/cases/new" className="underline">
              Start a case
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {summary.cases.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">
                    {item.brand} {item.model ?? ""}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{item.id}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/cases/${item.id}`}
                    className="text-[13px] underline"
                  >
                    Case
                  </Link>
                  <Link
                    href={`/reports/${item.id}`}
                    className="text-[13px] underline"
                  >
                    Report
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <form action={logoutAction}>
        <button
          type="submit"
          className="rounded-lg border border-border px-4 py-2 text-[13px] font-semibold"
        >
          Sign out
        </button>
      </form>
    </DashboardMain>
  );
}
