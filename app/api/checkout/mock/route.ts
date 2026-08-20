import { getPaymentProvider } from "@/lib/payments";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const paymentId = request.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.redirect(new URL("/pricing?error=missing_payment", request.url));
  }

  const provider = getPaymentProvider();
  if (provider.name !== "mock") {
    return NextResponse.redirect(new URL("/pricing?error=invalid_provider", request.url));
  }

  await provider.fulfillMockCheckout(paymentId);
  return NextResponse.redirect(new URL("/account?checkout=success", request.url));
}
