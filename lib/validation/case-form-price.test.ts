import { describe, expect, it } from "vitest";

import { caseCreateFormSchema } from "@/lib/validation";

describe("caseCreateFormSchema askingPrice", () => {
  it("treats an empty form field as missing, not zero", () => {
    const parsed = caseCreateFormSchema.safeParse({
      brand: "Rolex",
      askingPrice: "",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.askingPrice).toBeUndefined();
    }
  });

  it("keeps an explicit zero as a stated asking price", () => {
    const parsed = caseCreateFormSchema.safeParse({
      brand: "Rolex",
      askingPrice: "0",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.askingPrice).toBe(0);
    }
  });

  it("rejects a non-numeric asking price string", () => {
    expect(
      caseCreateFormSchema.safeParse({
        brand: "Rolex",
        askingPrice: "about 4k",
      }).success,
    ).toBe(false);
  });
});
