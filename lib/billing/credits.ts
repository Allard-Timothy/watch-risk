import { getDbClient } from "@/lib/db";
import type { SubscriptionStatus } from "@prisma/client";

export async function getOrCreateCredits(userId: string) {
  const db = getDbClient();
  return db.reportCredit.upsert({
    where: { userId },
    create: { userId, balance: 0 },
    update: {},
  });
}

export async function getCreditBalance(userId: string): Promise<number> {
  const wallet = await getOrCreateCredits(userId);
  return wallet.balance;
}

export async function addCredits(userId: string, amount: number): Promise<number> {
  const db = getDbClient();
  const wallet = await getOrCreateCredits(userId);
  const updated = await db.reportCredit.update({
    where: { id: wallet.id },
    data: { balance: wallet.balance + amount },
  });
  return updated.balance;
}

export async function consumeCredit(userId: string): Promise<boolean> {
  const db = getDbClient();
  const wallet = await getOrCreateCredits(userId);
  if (wallet.balance <= 0) {
    return false;
  }
  await db.reportCredit.update({
    where: { id: wallet.id },
    data: { balance: wallet.balance - 1 },
  });
  return true;
}

export async function getSubscription(userId: string) {
  const db = getDbClient();
  return db.subscription.findUnique({ where: { userId } });
}

export async function activateSubscription(userId: string) {
  const db = getDbClient();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  const sub = await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      status: "ACTIVE" satisfies SubscriptionStatus,
      currentPeriodEnd: periodEnd,
      monthlyCredits: 3,
    },
    update: {
      status: "ACTIVE",
      currentPeriodEnd: periodEnd,
    },
  });
  await addCredits(userId, sub.monthlyCredits);
  return sub;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (!sub || sub.status !== "ACTIVE") {
    return false;
  }
  if (sub.currentPeriodEnd && sub.currentPeriodEnd < new Date()) {
    return false;
  }
  return true;
}
