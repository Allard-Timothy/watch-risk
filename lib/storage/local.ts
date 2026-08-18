import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_ROOT = path.join(process.cwd(), ".data", "uploads");

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

const ID_PATTERN = /^[\w-]+$/;

export function extensionForMime(mime: string): string | null {
  return MIME_TO_EXT[mime] ?? null;
}

export function mimeForStoragePath(storagePath: string): string {
  const ext = path.extname(storagePath).toLowerCase();
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

export function sanitizeOriginalName(name: string): string {
  const base = path.basename(name);
  const withoutExt = base.replace(/\.[^.]+$/, "").trim() || "photo";
  const cleaned =
    withoutExt.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^\.+/, "") || "photo";
  return cleaned.slice(0, 80);
}

function resolveStoragePath(storagePath: string): string {
  const resolved = path.resolve(UPLOAD_ROOT, storagePath);
  const root = path.resolve(UPLOAD_ROOT);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error("Invalid storage path");
  }
  return resolved;
}

export async function writeCasePhotoFile(
  caseId: string,
  imageId: string,
  buffer: Buffer,
  extension: string,
  originalName = "photo",
): Promise<string> {
  if (!ID_PATTERN.test(caseId) || !ID_PATTERN.test(imageId)) {
    throw new Error("Invalid storage path");
  }
  const storagePath = `${caseId}/${imageId}-${sanitizeOriginalName(originalName)}${extension}`;
  const absolute = resolveStoragePath(storagePath);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, buffer);
  return storagePath;
}

export async function readCasePhotoFile(storagePath: string): Promise<Buffer> {
  return readFile(resolveStoragePath(storagePath));
}

export async function deleteCasePhotoFile(storagePath: string): Promise<void> {
  try {
    await unlink(resolveStoragePath(storagePath));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw error;
    }
  }
}
