import type { CaseImage, WatchCase } from "@prisma/client";

import { getDbClient } from "@/lib/db";
import {
  claimedTypeToPrisma,
  prismaToClaimedType,
  type ClaimedPhotoType,
} from "@/lib/photos";
import type { CaseCreateInput } from "@/lib/validation";
import {
  decodeUnresolvedHandle,
  encodeUnresolvedHandle,
} from "@/lib/knowledge/resolve";

export type CasePhoto = Readonly<{
  id: string;
  fileName: string;
  url: string;
  claimedType: ClaimedPhotoType | "";
  storagePath: string;
}>;

export type PersistedWatchCase = CaseCreateInput &
  Readonly<{
    id: string;
    userId?: string;
    createdAt: Date;
    sellerId?: string;
    typedSellerHandle?: string;
    status: string;
    photos: readonly CasePhoto[];
  }>;

export function casePhotoUrl(caseId: string, imageId: string): string {
  return `/api/cases/${caseId}/images/${imageId}`;
}

function fileNameFromStoragePath(storagePath: string): string {
  const base = storagePath.split("/").pop() ?? storagePath;
  return (
    base.replace(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
      "",
    ) || base
  );
}

function toCasePhoto(row: CaseImage): CasePhoto {
  return {
    id: row.id,
    fileName: fileNameFromStoragePath(row.storagePath),
    url: casePhotoUrl(row.caseId, row.id),
    claimedType: prismaToClaimedType(row.claimedType),
    storagePath: row.storagePath,
  };
}

function toCaseCreateInput(
  row: WatchCase & { images?: CaseImage[] },
): PersistedWatchCase {
  const decoded = decodeUnresolvedHandle(row.listingText ?? undefined);
  return {
    id: row.id,
    userId: row.userId ?? undefined,
    brand: row.brand,
    model: row.model ?? undefined,
    reference: row.reference ?? undefined,
    claimedYear: row.claimedYear ?? undefined,
    askingPrice:
      row.askingPrice === null ? undefined : Number(row.askingPrice),
    sellerPlatform: row.sellerPlatform ?? undefined,
    listingUrl: row.listingUrl ?? undefined,
    listingText: decoded.listingText,
    sellerClaims: row.sellerClaims ?? undefined,
    createdAt: row.createdAt,
    sellerId: row.sellerId ?? undefined,
    typedSellerHandle: decoded.typedSellerHandle,
    status: row.status,
    photos: (row.images ?? []).map(toCasePhoto),
  };
}

export async function createWatchCase(
  input: CaseCreateInput,
  options?: {
    sellerId?: string;
    typedSellerHandle?: string;
    userId?: string;
  },
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
      listingText: encodeUnresolvedHandle(
        input.listingText,
        options?.typedSellerHandle,
      ),
      sellerClaims: input.sellerClaims,
      sellerId: options?.sellerId,
      userId: options?.userId,
      status: "DRAFT",
    },
    include: { images: true },
  });
  return toCaseCreateInput(row);
}

export async function listWatchCases(
  limit = 12,
  userId?: string,
): Promise<PersistedWatchCase[]> {
  const db = getDbClient();
  const rows = await db.watchCase.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
  return rows.map(toCaseCreateInput);
}

export async function getWatchCaseWithOwner(id: string) {
  const db = getDbClient();
  return db.watchCase.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true },
  });
}

export async function getWatchCase(
  id: string,
): Promise<PersistedWatchCase | null> {
  const db = getDbClient();
  const row = await db.watchCase.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: "asc" } } },
  });
  return row ? toCaseCreateInput(row) : null;
}

export async function getCaseImage(
  caseId: string,
  imageId: string,
): Promise<CasePhoto | null> {
  const db = getDbClient();
  const row = await db.caseImage.findFirst({
    where: { id: imageId, caseId },
  });
  return row ? toCasePhoto(row) : null;
}

export async function createCaseImage(input: {
  caseId: string;
  storagePath: string;
  claimedType?: ClaimedPhotoType | "";
}): Promise<CasePhoto> {
  const db = getDbClient();
  const row = await db.caseImage.create({
    data: {
      caseId: input.caseId,
      storagePath: input.storagePath,
      claimedType: input.claimedType
        ? claimedTypeToPrisma(input.claimedType)
        : null,
    },
  });
  return toCasePhoto(row);
}

export async function updateCaseImageType(
  caseId: string,
  imageId: string,
  claimedType: ClaimedPhotoType | "",
): Promise<CasePhoto | null> {
  const existing = await getCaseImage(caseId, imageId);
  if (!existing) {
    return null;
  }
  const db = getDbClient();
  const row = await db.caseImage.update({
    where: { id: imageId },
    data: {
      claimedType: claimedType ? claimedTypeToPrisma(claimedType) : null,
    },
  });
  return toCasePhoto(row);
}

export async function deleteCaseImage(
  caseId: string,
  imageId: string,
): Promise<CasePhoto | null> {
  const existing = await getCaseImage(caseId, imageId);
  if (!existing) {
    return null;
  }
  const db = getDbClient();
  await db.caseImage.delete({ where: { id: imageId } });
  return existing;
}
