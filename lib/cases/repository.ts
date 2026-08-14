import type { WatchCase } from "@prisma/client";

import { getDbClient } from "@/lib/db";
import type { CaseCreateInput } from "@/lib/validation";

export type PersistedWatchCase = CaseCreateInput &
  Readonly<{
    id: string;
  }>;

function toCaseCreateInput(row: WatchCase): PersistedWatchCase {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model ?? undefined,
    reference: row.reference ?? undefined,
    claimedYear: row.claimedYear ?? undefined,
    askingPrice:
      row.askingPrice === null ? undefined : Number(row.askingPrice),
    sellerPlatform: row.sellerPlatform ?? undefined,
    listingUrl: row.listingUrl ?? undefined,
    listingText: row.listingText ?? undefined,
    sellerClaims: row.sellerClaims ?? undefined,
  };
}

export async function createWatchCase(
  input: CaseCreateInput,
): Promise<PersistedWatchCase> {
  const db = getDbClient();
  const row = await db.watchCase.create({
    data: {
      brand: input.brand,
      model: input.model,
      reference: input.reference,
      claimedYear: input.claimedYear,
      askingPrice: input.askingPrice,
      sellerPlatform: input.sellerPlatform,
      listingUrl: input.listingUrl,
      listingText: input.listingText,
      sellerClaims: input.sellerClaims,
      status: "DRAFT",
    },
  });
  return toCaseCreateInput(row);
}

export async function getWatchCase(
  id: string,
): Promise<PersistedWatchCase | null> {
  const db = getDbClient();
  const row = await db.watchCase.findUnique({ where: { id } });
  return row ? toCaseCreateInput(row) : null;
}
