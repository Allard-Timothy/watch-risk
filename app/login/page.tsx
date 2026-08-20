import Link from "next/link";

import { Card, DashboardMain, PageTitle } from "@/components/dashboard-main";
import { loginAction } from "@/lib/auth/actions";

export default function LoginPage() {
  return (
    <DashboardMain>
      <PageTitle
        kicker="Account"
        title="Sign in"
        subtitle="We email you a magic link. In development the link is printed to the server log."
      />
      <Card className="max-w-md p-6">
        <form action={loginAction} className="space-y-4">
          <label className="block text-[13px] font-medium">
            Email
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px]"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
          >
            Email me a sign-in link
          </button>
        </form>
        <p className="mt-4 text-[12px] leading-5 text-muted-foreground">
          The sample report at{" "}
          <Link href="/reports/WR-2026-0481" className="underline">
            WR-2026-0481
          </Link>{" "}
          stays public without an account.
        </p>
      </Card>
    </DashboardMain>
  );
}
