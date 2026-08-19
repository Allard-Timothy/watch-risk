import { describe, expect, it } from "vitest";

import { matchFactory } from "./match-factory";
import { factorySeedSchema } from "./schemas";

const factories = [
  factorySeedSchema.parse({
    factoryId: "vsf",
    canonicalName: "VSF",
    defects: [],
  }),
  factorySeedSchema.parse({
    factoryId: "unknown",
    canonicalName: "Unknown",
    defects: [],
  }),
];

describe("matchFactory", () => {
  it("matches VSF by id or display name", () => {
    expect(matchFactory(factories, "VSF")?.factoryId).toBe("vsf");
    expect(matchFactory(factories, "vsf")?.factoryId).toBe("vsf");
  });

  it("falls back to unknown when the label is missing or unmapped", () => {
    expect(matchFactory(factories)?.factoryId).toBe("unknown");
    expect(matchFactory(factories, "clean")?.factoryId).toBe("unknown");
  });
});
