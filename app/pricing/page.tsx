import Link from "next/link";

import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { checkoutAction } from "@/lib/billing/actions";
import { SKUS } from "@/lib/billing/skus";
import { auth } from "@/lib/auth";

export default async function PricingPage() {
  const session = await auth();

  return (
    <DashboardMain>
      <PageTitle
        kicker="Billing"
        title="Pricing"
        subtitle="The paid product is the listing report. Subscribers also get knowledge explorers (DEC-003)."
      />
      {!session?.user ? (
        <p className="mb-4 text-[13px] text-muted-foreground">
          <Link href="/login" className="underline">
            Sign in
          </Link>{" "}
          before checkout so credits attach to your account.
        </p>
      ) : null}
      <ul className="grid gap-4 md:grid-cols-2">
        {SKUS.map((sku) => (
          <Card key={sku.id} className="flex flex-col p-6">
            <h2 className="font-serif text-2xl">{sku.name}</h2>
            <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
              {sku.description}
            </p>
            <p className="mt-4 text-xl font-semibold">
              ${(sku.priceCents / 100).toFixed(2)}
              {sku.subscription ? (
                <span className="text-[13px] font-normal text-muted-foreground">
                  {" "}
                  / month
                </span>
              ) : null}
            </p>
            {session?.user ? (
              <form action={checkoutAction} className="mt-4">
                <input type="hidden" name="sku" value={sku.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
                >
                  Continue to checkout
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="mt-4 inline-flex w-fit rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
              >
                Sign in to purchase
              </Link>
            )}
          </Card>
        ))}
      </ul>
    </DashboardMain>
  );
}
