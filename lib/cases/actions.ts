"use server";

import { randomUUID } from "node:crypto";

import {
  createCaseImage,
  createWatchCase,
  deleteCaseImage,
  getWatchCase,
  updateCaseImageType,
  type CasePhoto,
} from "@/lib/cases/repository";
import type { ClaimedPhotoType } from "@/lib/photos";
import {
  deleteCasePhotoFile,
  extensionForMime,
  MAX_PHOTO_BYTES,
  writeCasePhotoFile,
} from "@/lib/storage/local";
import { loadCommunities, loadSellers } from "@/lib/knowledge/load";
import { ensureSellerPersisted } from "@/lib/knowledge/persist";
import {
  matchIntakeSeller,
  type IntakeSellerMatch,
} from "@/lib/knowledge/resolve";
import {
  caseCreateFormSchema,
  type CaseCreateFormInput,
} from "@/lib/validation";

type FieldName = keyof CaseCreateFormInput;

export type CreateCaseSellerMatch =
  | Readonly<{ kind: "none" }>
  | Readonly<{ kind: "resolved"; id: string; name: string }>
  | Readonly<{ kind: "unresolved"; handle: string }>;

export type CreateCaseResult =
  | Readonly<{ ok: true; id: string; sellerMatch: CreateCaseSellerMatch }>
  | Readonly<{
      ok: false;
      errors?: Partial<Record<FieldName, string>>;
      message?: string;
    }>;

function toCreateCaseSellerMatch(
  match: IntakeSellerMatch,
): CreateCaseSellerMatch {
  if (match.kind === "resolved") {
    return {
      kind: "resolved",
      id: match.seller.sellerId,
      name: match.seller.canonicalName,
    };
  }
  if (match.kind === "unresolved") {
    return { kind: "unresolved", handle: match.handle };
  }
  return { kind: "none" };
}

export async function createCaseAction(
  raw: Record<string, string>,
): Promise<CreateCaseResult> {
  const parsed = caseCreateFormSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Partial<Record<FieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldName | undefined;
      if (key && !errors[key]) {
        errors[key] = issue.message;
      }
    }
    return { ok: false, errors };
  }

  try {
    const { sellerHandle, ...listing } = parsed.data;
    const sellers = await loadSellers();
    const match = matchIntakeSeller(sellers, sellerHandle);
    if (match.kind === "resolved") {
      const communities = await loadCommunities();
      await ensureSellerPersisted(match.seller, communities);
    }
    const created = await createWatchCase(listing, {
      sellerId: match.kind === "resolved" ? match.seller.sellerId : undefined,
      typedSellerHandle:
        match.kind === "unresolved" ? match.handle : undefined,
    });
    return {
      ok: true,
      id: created.id,
      sellerMatch: toCreateCaseSellerMatch(match),
    };
  } catch (error) {
    console.error("createWatchCase failed", error);
    return {
      ok: false,
      message:
        "Could not save the case. Check that Postgres is running and DATABASE_URL is set.",
    };
  }
}

export type PhotoActionResult =
  | Readonly<{ ok: true; photo: CasePhoto }>
  | Readonly<{ ok: false; message: string }>;

export async function uploadCasePhotoAction(
  caseId: string,
  formData: FormData,
): Promise<PhotoActionResult> {
  const listing = await getWatchCase(caseId);
  if (!listing) {
    return { ok: false, message: "Case not found." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, message: "Choose an image file." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Only image files are accepted." };
  }
  const extension = extensionForMime(file.type);
  if (!extension) {
    return { ok: false, message: "Use JPEG, PNG, WebP, or GIF." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, message: "Each photo must be 8 MB or smaller." };
  }

  const imageId = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const storagePath = await writeCasePhotoFile(
      caseId,
      imageId,
      buffer,
      extension,
      file.name,
    );
    const photo = await createCaseImage({
      caseId,
      storagePath,
    });
    return { ok: true, photo };
  } catch (error) {
    console.error("uploadCasePhotoAction failed", error);
    return {
      ok: false,
      message: "Could not store the photo. Check disk and database.",
    };
  }
}

export async function updateCasePhotoTypeAction(
  caseId: string,
  imageId: string,
  claimedType: ClaimedPhotoType | "",
): Promise<PhotoActionResult> {
  try {
    const photo = await updateCaseImageType(caseId, imageId, claimedType);
    if (!photo) {
      return { ok: false, message: "Photo not found." };
    }
    return { ok: true, photo };
  } catch (error) {
    console.error("updateCasePhotoTypeAction failed", error);
    return { ok: false, message: "Could not update the photo type." };
  }
}

export async function deleteCasePhotoAction(
  caseId: string,
  imageId: string,
): Promise<Readonly<{ ok: true }> | Readonly<{ ok: false; message: string }>> {
  try {
    const photo = await deleteCaseImage(caseId, imageId);
    if (!photo) {
      return { ok: false, message: "Photo not found." };
    }
    await deleteCasePhotoFile(photo.storagePath);
    return { ok: true };
  } catch (error) {
    console.error("deleteCasePhotoAction failed", error);
    return { ok: false, message: "Could not remove the photo." };
  }
}
