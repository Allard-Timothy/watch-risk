"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getCreditBalance, getSubscription } from "@/lib/billing/credits";
import { listWatchCases } from "@/lib/cases/repository";
import { getPaymentProvider } from "@/lib/payments";
import type { SkuId } from "@/lib/payments/types";

export async function checkoutAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const sku = String(formData.get("sku") ?? "") as SkuId;
  const caseId = String(formData.get("caseId") ?? "").trim() || undefined;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const provider = getPaymentProvider();
  const result = await provider.createCheckout({
    userId: session.user.id,
    sku,
    caseId,
    successUrl: `${base}/account?checkout=success`,
    cancelUrl: `${base}/pricing?checkout=canceled`,
  });
  redirect(result.checkoutUrl);
}

export async function getAccountSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const [cases, balance, subscription] = await Promise.all([
    listWatchCases(20, session.user.id),
    getCreditBalance(session.user.id),
    getSubscription(session.user.id),
  ]);
  return {
    user: session.user,
    cases,
    balance,
    subscription,
  };
}
