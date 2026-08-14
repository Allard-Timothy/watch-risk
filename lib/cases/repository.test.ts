import { afterAll, describe, expect, it } from "vitest";

import { getDbClient } from "@/lib/db";
import { createWatchCase, getWatchCase } from "./repository";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://watchrisk:watchrisk@localhost:5432/watchrisk?schema=public";

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
});

afterAll(async () => {
  await getDbClient().$disconnect();
});
