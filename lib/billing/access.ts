import { hasActiveSubscription } from "./credits";

export type ExplorerAccess = Readonly<{
  allowed: boolean;
  reason: string;
}>;

/**
 * Knowledge explorers require an active subscription, mock payments mode,
 * or an authenticated dev bypass.
 */
export async function canAccessExplorers(
  userId: string | undefined,
): Promise<ExplorerAccess> {
  if (process.env.PAYMENTS_MODE === "mock" || process.env.NODE_ENV === "development") {
    return {
      allowed: true,
      reason: "Explorers are open in development and mock payment mode.",
    };
  }
  if (!userId) {
    return {
      allowed: false,
      reason: "Sign in and subscribe to browse knowledge explorers.",
    };
  }
  const subscribed = await hasActiveSubscription(userId);
  return subscribed
    ? { allowed: true, reason: "Active subscription." }
    : {
        allowed: false,
        reason: "Subscribe to browse seller, factory, and reference intelligence.",
      };
}

export async function canGenerateReport(input: {
  userId: string | undefined;
  caseUserId: string | null | undefined;
  caseStatus: string;
}): Promise<{ allowed: boolean; reason: string }> {
  if (process.env.PAYMENTS_MODE === "mock" || process.env.NODE_ENV === "development") {
    return { allowed: true, reason: "Reports are free in development/mock mode." };
  }
  if (!input.userId) {
    return { allowed: false, reason: "Sign in to generate a report." };
  }
  if (input.caseUserId && input.caseUserId !== input.userId) {
    return { allowed: false, reason: "This case belongs to another account." };
  }
  if (input.caseStatus === "PAID" || input.caseStatus === "COMPLETE") {
    return { allowed: true, reason: "Case already paid." };
  }
  return {
    allowed: false,
    reason: "Purchase a report credit or pay for this case first.",
  };
}
