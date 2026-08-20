export type SkuId =
  | "single_report"
  | "bundle_5"
  | "bundle_10"
  | "subscription_monthly";

export type CheckoutInput = Readonly<{
  userId: string;
  sku: SkuId;
  caseId?: string;
  successUrl: string;
  cancelUrl: string;
}>;

export type CheckoutResult = Readonly<{
  provider: "mock" | "stripe";
  checkoutUrl: string;
  paymentRecordId: string;
}>;

export type PaymentProvider = Readonly<{
  name: "mock" | "stripe";
  configured: boolean;
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  fulfillMockCheckout(paymentRecordId: string): Promise<void>;
}>;

export const SKU_CREDITS: Record<
  Exclude<SkuId, "subscription_monthly">,
  number
> = {
  single_report: 1,
  bundle_5: 5,
  bundle_10: 10,
};

export const SKU_PRICES_CENTS: Record<SkuId, number> = {
  single_report: 900,
  bundle_5: 3500,
  bundle_10: 6000,
  subscription_monthly: 1900,
};
