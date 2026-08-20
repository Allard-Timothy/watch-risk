import { getDbClient } from "@/lib/db";
import {
  addCredits,
  activateSubscription,
} from "@/lib/billing/credits";
import type {
  CheckoutInput,
  CheckoutResult,
  PaymentProvider,
  SkuId,
} from "./types";
import { SKU_CREDITS, SKU_PRICES_CENTS } from "./types";

async function createPaymentRecord(input: CheckoutInput) {
  const db = getDbClient();
  return db.paymentRecord.create({
    data: {
      userId: input.userId,
      caseId: input.caseId,
      sku: input.sku,
      amountCents: SKU_PRICES_CENTS[input.sku],
      status: "CREATED",
    },
  });
}

export function createMockPaymentProvider(): PaymentProvider {
  return {
    name: "mock",
    configured: true,
    async createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
      const record = await createPaymentRecord(input);
      const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      return {
        provider: "mock",
        checkoutUrl: `${base}/api/checkout/mock?paymentId=${record.id}`,
        paymentRecordId: record.id,
      };
    },
    async fulfillMockCheckout(paymentRecordId: string): Promise<void> {
      const db = getDbClient();
      const record = await db.paymentRecord.findUnique({
        where: { id: paymentRecordId },
      });
      if (!record || record.status === "PAID") {
        return;
      }
      if (!record.userId || !record.sku) {
        throw new Error("Payment record is missing user or sku.");
      }

      await db.paymentRecord.update({
        where: { id: paymentRecordId },
        data: { status: "PAID" },
      });

      const sku = record.sku as SkuId;
      if (sku === "subscription_monthly") {
        await activateSubscription(record.userId);
        return;
      }

      const credits = SKU_CREDITS[sku as keyof typeof SKU_CREDITS];
      if (credits) {
        await addCredits(record.userId, credits);
      }

      if (record.caseId) {
        await db.watchCase.update({
          where: { id: record.caseId },
          data: { status: "PAID" },
        });
      }
    },
  };
}
