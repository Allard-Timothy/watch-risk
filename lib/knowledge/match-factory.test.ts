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

  it("matches a factory by canonical name when the id differs", () => {
    const withDisplayName = [
      factorySeedSchema.parse({
        factoryId: "cf",
        canonicalName: "Clean Factory",
        defects: [],
      }),
      ...factories,
    ];
    expect(matchFactory(withDisplayName, " Clean Factory ")?.factoryId).toBe(
      "cf",
    );
  });

  it("falls back to unknown when the label is missing or unmapped", () => {
    expect(matchFactory(factories)?.factoryId).toBe("unknown");
    expect(matchFactory(factories, "clean")?.factoryId).toBe("unknown");
    expect(matchFactory(factories, "  ")).toEqual(
      factories.find((factory) => factory.factoryId === "unknown"),
    );
  });

  it("returns undefined when nothing matches and there is no unknown factory", () => {
    expect(
      matchFactory(
        [factorySeedSchema.parse({ factoryId: "vsf", canonicalName: "VSF" })],
        "clean",
      ),
    ).toBeUndefined();
  });
});
