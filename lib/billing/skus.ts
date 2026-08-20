import type { SkuId } from "@/lib/payments/types";
import { SKU_CREDITS, SKU_PRICES_CENTS } from "@/lib/payments/types";

export type SkuDefinition = Readonly<{
  id: SkuId;
  name: string;
  description: string;
  priceCents: number;
  credits?: number;
  subscription?: boolean;
}>;

export const SKUS: readonly SkuDefinition[] = [
  {
    id: "single_report",
    name: "Single report",
    description: "One photo-based buyer-risk report for a saved case.",
    priceCents: SKU_PRICES_CENTS.single_report,
    credits: SKU_CREDITS.single_report,
  },
  {
    id: "bundle_5",
    name: "5-report bundle",
    description: "Five report credits you can use on any saved case.",
    priceCents: SKU_PRICES_CENTS.bundle_5,
    credits: SKU_CREDITS.bundle_5,
  },
  {
    id: "bundle_10",
    name: "10-report bundle",
    description: "Ten report credits for frequent buyers.",
    priceCents: SKU_PRICES_CENTS.bundle_10,
    credits: SKU_CREDITS.bundle_10,
  },
  {
    id: "subscription_monthly",
    name: "Monthly subscription",
    description:
      "Browse knowledge explorers and receive monthly report credits.",
    priceCents: SKU_PRICES_CENTS.subscription_monthly,
    subscription: true,
  },
];

export function findSku(id: string): SkuDefinition | undefined {
  return SKUS.find((sku) => sku.id === id);
}
