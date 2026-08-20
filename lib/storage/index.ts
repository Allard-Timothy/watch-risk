import {
  deleteCasePhotoFile,
  extensionForMime,
  mimeForStoragePath,
  readCasePhotoFile,
  sanitizeOriginalName,
  writeCasePhotoFile,
  MAX_PHOTO_BYTES,
} from "./local";

export type StorageProvider = Readonly<{
  name: "local" | "gcs";
  configured: boolean;
  writeCasePhoto: typeof writeCasePhotoFile;
  readCasePhoto: typeof readCasePhotoFile;
  deleteCasePhoto: typeof deleteCasePhotoFile;
  extensionForMime: typeof extensionForMime;
  mimeForStoragePath: typeof mimeForStoragePath;
  sanitizeOriginalName: typeof sanitizeOriginalName;
  maxPhotoBytes: number;
}>;

export class StorageNotConfiguredError extends Error {
  constructor(message = "Cloud storage is not configured.") {
    super(message);
    this.name = "StorageNotConfiguredError";
  }
}

export function getStorageProvider(): StorageProvider {
  if (process.env.GCS_BUCKET?.trim()) {
    return {
      name: "gcs",
      configured: false,
      writeCasePhoto: async () => {
        throw new StorageNotConfiguredError(
          "GCS_BUCKET is set but the GCS client is not wired yet.",
        );
      },
      readCasePhoto: async () => {
        throw new StorageNotConfiguredError(
          "GCS_BUCKET is set but the GCS client is not wired yet.",
        );
      },
      deleteCasePhoto: async () => {
        throw new StorageNotConfiguredError(
          "GCS_BUCKET is set but the GCS client is not wired yet.",
        );
      },
      extensionForMime,
      mimeForStoragePath,
      sanitizeOriginalName,
      maxPhotoBytes: MAX_PHOTO_BYTES,
    };
  }

  return {
    name: "local",
    configured: true,
    writeCasePhoto: writeCasePhotoFile,
    readCasePhoto: readCasePhotoFile,
    deleteCasePhoto: deleteCasePhotoFile,
    extensionForMime,
    mimeForStoragePath,
    sanitizeOriginalName,
    maxPhotoBytes: MAX_PHOTO_BYTES,
  };
}

export {
  deleteCasePhotoFile,
  extensionForMime,
  MAX_PHOTO_BYTES,
  mimeForStoragePath,
  readCasePhotoFile,
  sanitizeOriginalName,
  writeCasePhotoFile,
} from "./local";
