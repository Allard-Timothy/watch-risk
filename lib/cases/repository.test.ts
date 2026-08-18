import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import {
  deleteCasePhotoFile,
  writeCasePhotoFile,
} from "@/lib/storage/local";
import {
  createCaseImage,
  createWatchCase,
  deleteCaseImage,
  getWatchCase,
  updateCaseImageType,
} from "./repository";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://watchrisk:watchrisk@localhost:5432/watchrisk?schema=public";

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("watch case repository", () => {
  it("persists listing details and reloads them by id", async () => {
    process.env.DATABASE_URL = DATABASE_URL;

    const created = await createWatchCase({
      brand: "Tudor",
      model: "Black Bay 58",
      reference: "79030N",
      claimedYear: "2022",
      askingPrice: 2950,
      sellerPlatform: "Chrono24",
      listingUrl: "https://example.com/listing",
      listingText: "Sample listing text",
      sellerClaims: "Box and papers claimed",
    });

    expect(created.id).toMatch(/^c/);
    expect(created.brand).toBe("Tudor");
    expect(created.askingPrice).toBe(2950);
    expect(created.photos).toEqual([]);

    const loaded = await getWatchCase(created.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(created.id);
    expect(loaded?.brand).toBe("Tudor");
    expect(loaded?.model).toBe("Black Bay 58");
    expect(loaded?.reference).toBe("79030N");
    expect(loaded?.askingPrice).toBe(2950);
    expect(loaded?.listingUrl).toBe("https://example.com/listing");
    expect(loaded?.listingText).toBe("Sample listing text");

    const missing = await getWatchCase("does-not-exist");
    expect(missing).toBeNull();

    await getDbClient().watchCase.delete({ where: { id: created.id } });
  });

  it("stores CaseImage rows and claimed types with the case", async () => {
    process.env.DATABASE_URL = DATABASE_URL;

    const created = await createWatchCase({
      brand: "Omega",
      model: "Speedmaster",
      askingPrice: 6400,
      listingText: undefined,
      sellerClaims: undefined,
    });

    const storagePath = await writeCasePhotoFile(
      created.id,
      "11111111-1111-4111-8111-111111111111",
      TINY_PNG,
      ".png",
      "dial.png",
    );
    const photo = await createCaseImage({
      caseId: created.id,
      storagePath,
      claimedType: "dial",
    });

    expect(photo.claimedType).toBe("dial");
    expect(photo.fileName).toBe("dial.png");
    expect(photo.url).toBe(`/api/cases/${created.id}/images/${photo.id}`);

    const labeled = await updateCaseImageType(created.id, photo.id, "bracelet");
    expect(labeled?.claimedType).toBe("bracelet");

    const loaded = await getWatchCase(created.id);
    expect(loaded?.photos).toHaveLength(1);
    expect(loaded?.photos[0]?.claimedType).toBe("bracelet");

    await deleteCaseImage(created.id, photo.id);
    await deleteCasePhotoFile(storagePath);
    await getDbClient().watchCase.delete({ where: { id: created.id } });
  });
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
