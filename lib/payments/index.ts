import { createMockPaymentProvider } from "./mock";
import type { PaymentProvider } from "./types";

export class StripeNotConfiguredError extends Error {
  constructor(message = "Stripe is not configured.") {
    super(message);
    this.name = "StripeNotConfiguredError";
  }
}

function createStripePaymentProvider(): PaymentProvider {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return {
      name: "stripe",
      configured: false,
      async createCheckout() {
        throw new StripeNotConfiguredError();
      },
      async fulfillMockCheckout() {
        throw new StripeNotConfiguredError();
      },
    };
  }

  return {
    name: "stripe",
    configured: true,
    async createCheckout() {
      throw new StripeNotConfiguredError(
        "Stripe Checkout is not wired yet. Set PAYMENTS_MODE=mock for local development.",
      );
    },
    async fulfillMockCheckout() {
      throw new StripeNotConfiguredError();
    },
  };
}

export function getPaymentProvider(): PaymentProvider {
  const mode = process.env.PAYMENTS_MODE ?? "mock";
  if (mode === "stripe" && process.env.STRIPE_SECRET_KEY?.trim()) {
    return createStripePaymentProvider();
  }
  return createMockPaymentProvider();
}

export type { CheckoutInput, CheckoutResult, PaymentProvider, SkuId } from "./types";
export { SKU_CREDITS, SKU_PRICES_CENTS } from "./types";
