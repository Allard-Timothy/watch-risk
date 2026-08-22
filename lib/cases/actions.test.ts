import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CasePhoto, PersistedWatchCase } from "@/lib/cases/repository";
import { sellerSeedSchema } from "@/lib/knowledge/schemas";

const {
  createWatchCase,
  getWatchCase,
  createCaseImage,
  deleteCaseImage,
  updateCaseImageType,
  writeCasePhotoFile,
  deleteCasePhotoFile,
  loadSellers,
  loadCommunities,
  ensureSellerPersisted,
} = vi.hoisted(() => ({
  createWatchCase: vi.fn(),
  getWatchCase: vi.fn(),
  createCaseImage: vi.fn(),
  deleteCaseImage: vi.fn(),
  updateCaseImageType: vi.fn(),
  writeCasePhotoFile: vi.fn(),
  deleteCasePhotoFile: vi.fn(),
  loadSellers: vi.fn(),
  loadCommunities: vi.fn(),
  ensureSellerPersisted: vi.fn(),
}));

vi.mock("@/lib/cases/repository", () => ({
  createWatchCase,
  getWatchCase,
  createCaseImage,
  deleteCaseImage,
  updateCaseImageType,
}));

vi.mock("@/lib/storage/local", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/storage/local")>();
  return {
    ...actual,
    MAX_PHOTO_BYTES: 32,
    writeCasePhotoFile,
    deleteCasePhotoFile,
  };
});

vi.mock("@/lib/knowledge/load", () => ({
  loadSellers,
  loadCommunities,
}));

vi.mock("@/lib/knowledge/persist", () => ({
  ensureSellerPersisted,
}));

const ddg = sellerSeedSchema.parse({
  sellerId: "ddgtop",
  canonicalName: "DDGTOP",
  aliases: [{ alias: "DDG Top", identityConfidence: 0.95 }],
});

const listing: PersistedWatchCase = {
  id: "case_test_1",
  brand: "Omega",
  listingText: undefined,
  sellerClaims: undefined,
  createdAt: new Date("2026-08-14T00:00:00.000Z"),
  photos: [],
};

const photo: CasePhoto = {
  id: "img_1",
  fileName: "dial.png",
  url: "/api/cases/case_test_1/images/img_1",
  claimedType: "",
  storagePath: "case_test_1/img_1-dial.png",
};

function imageFile(
  name: string,
  type: string,
  bytes = 8,
): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("createCaseAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadSellers.mockResolvedValue([ddg]);
    loadCommunities.mockResolvedValue([]);
    ensureSellerPersisted.mockResolvedValue(undefined);
    createWatchCase.mockResolvedValue({ ...listing, id: "case_saved" });
  });

  it("returns field errors when brand is missing", async () => {
    const { createCaseAction } = await import("./actions");
    const result = await createCaseAction({ brand: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors?.brand).toMatch(/required/i);
    }
    expect(createWatchCase).not.toHaveBeenCalled();
  });

  it("persists a curated seller match before saving the case", async () => {
    const { createCaseAction } = await import("./actions");
    const result = await createCaseAction({
      brand: "Rolex",
      sellerHandle: "DDG Top",
    });

    expect(result).toEqual({
      ok: true,
      id: "case_saved",
      sellerMatch: { kind: "resolved", id: "ddgtop", name: "DDGTOP" },
    });
    expect(ensureSellerPersisted).toHaveBeenCalledWith(ddg, []);
    expect(createWatchCase).toHaveBeenCalledWith(
      expect.objectContaining({ brand: "Rolex" }),
      { sellerId: "ddgtop", typedSellerHandle: undefined },
    );
  });

  it("keeps an unmatched handle visible and does not persist a seller", async () => {
    const { createCaseAction } = await import("./actions");
    const result = await createCaseAction({
      brand: "Rolex",
      sellerHandle: "NotADealer",
    });

    expect(result).toEqual({
      ok: true,
      id: "case_saved",
      sellerMatch: { kind: "unresolved", handle: "NotADealer" },
    });
    expect(ensureSellerPersisted).not.toHaveBeenCalled();
    expect(createWatchCase).toHaveBeenCalledWith(
      expect.objectContaining({ brand: "Rolex" }),
      { sellerId: undefined, typedSellerHandle: "NotADealer" },
    );
  });

  it("returns a save error when Postgres is unavailable", async () => {
    createWatchCase.mockRejectedValue(new Error("ECONNREFUSED"));
    const { createCaseAction } = await import("./actions");
    const result = await createCaseAction({ brand: "Rolex" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/Postgres/i);
    }
  });
});

describe("uploadCasePhotoAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWatchCase.mockResolvedValue(listing);
    writeCasePhotoFile.mockResolvedValue(photo.storagePath);
    createCaseImage.mockResolvedValue(photo);
  });

  it("rejects a missing case, non-image, unsupported image, and oversized file", async () => {
    const { uploadCasePhotoAction } = await import("./actions");

    getWatchCase.mockResolvedValueOnce(null);
    expect(await uploadCasePhotoAction("missing", new FormData())).toEqual({
      ok: false,
      message: "Case not found.",
    });

    const noFile = new FormData();
    expect(await uploadCasePhotoAction("case_test_1", noFile)).toEqual({
      ok: false,
      message: "Choose an image file.",
    });

    const text = new FormData();
    text.set("file", imageFile("notes.txt", "text/plain"));
    expect(await uploadCasePhotoAction("case_test_1", text)).toEqual({
      ok: false,
      message: "Only image files are accepted.",
    });

    const svg = new FormData();
    svg.set("file", imageFile("watch.svg", "image/svg+xml"));
    expect(await uploadCasePhotoAction("case_test_1", svg)).toEqual({
      ok: false,
      message: "Use JPEG, PNG, WebP, or GIF.",
    });

    const huge = new FormData();
    huge.set("file", imageFile("dial.png", "image/png", 64));
    expect(await uploadCasePhotoAction("case_test_1", huge)).toEqual({
      ok: false,
      message: "Each photo must be 8 MB or smaller.",
    });
  });

  it("stores an accepted image and returns the photo metadata", async () => {
    const { uploadCasePhotoAction } = await import("./actions");
    const form = new FormData();
    form.set("file", imageFile("dial.png", "image/png"));

    expect(await uploadCasePhotoAction("case_test_1", form)).toEqual({
      ok: true,
      photo,
    });
    expect(writeCasePhotoFile).toHaveBeenCalled();
    expect(createCaseImage).toHaveBeenCalledWith({
      caseId: "case_test_1",
      storagePath: photo.storagePath,
    });
  });
});

describe("update and delete photo actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns not found when the photo row is missing", async () => {
    updateCaseImageType.mockResolvedValue(null);
    deleteCaseImage.mockResolvedValue(null);
    const { deleteCasePhotoAction, updateCasePhotoTypeAction } = await import(
      "./actions"
    );

    expect(
      await updateCasePhotoTypeAction("case_test_1", "img_missing", "dial"),
    ).toEqual({ ok: false, message: "Photo not found." });
    expect(await deleteCasePhotoAction("case_test_1", "img_missing")).toEqual({
      ok: false,
      message: "Photo not found.",
    });
    expect(deleteCasePhotoFile).not.toHaveBeenCalled();
  });

  it("updates a claimed type and deletes the stored file with the row", async () => {
    updateCaseImageType.mockResolvedValue({ ...photo, claimedType: "dial" });
    deleteCaseImage.mockResolvedValue(photo);
    deleteCasePhotoFile.mockResolvedValue(undefined);
    const { deleteCasePhotoAction, updateCasePhotoTypeAction } = await import(
      "./actions"
    );

    expect(
      await updateCasePhotoTypeAction("case_test_1", "img_1", "dial"),
    ).toEqual({ ok: true, photo: { ...photo, claimedType: "dial" } });
    expect(await deleteCasePhotoAction("case_test_1", "img_1")).toEqual({
      ok: true,
    });
    expect(deleteCasePhotoFile).toHaveBeenCalledWith(photo.storagePath);
  });
});
