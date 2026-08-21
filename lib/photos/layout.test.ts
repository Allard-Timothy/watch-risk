import { describe, expect, it } from "vitest";

import { heroPhotoLayout } from "@/lib/photos/layout";

describe("heroPhotoLayout", () => {
  it("prefers dial, bracelet, and caseback labels", () => {
    const layout = heroPhotoLayout([
      { id: "1", claimedType: "caseback", url: "/a" },
      { id: "2", claimedType: "dial", url: "/b" },
      { id: "3", claimedType: "bracelet", url: "/c" },
    ]);

    expect(layout.primary?.id).toBe("2");
    expect(layout.secondary?.id).toBe("3");
    expect(layout.tertiary?.id).toBe("1");
  });

  it("falls back to upload order when labels are missing", () => {
    const layout = heroPhotoLayout([
      { id: "a", claimedType: "", url: "/a" },
      { id: "b", claimedType: "", url: "/b" },
      { id: "c", claimedType: "", url: "/c" },
    ]);

    expect(layout.primary?.id).toBe("a");
    expect(layout.secondary?.id).toBe("b");
    expect(layout.tertiary?.id).toBe("c");
  });

  it("does not reuse a labeled hero photo when filling remaining wells", () => {
    const layout = heroPhotoLayout([
      { id: "dial", claimedType: "dial", url: "/dial" },
      { id: "caseback", claimedType: "caseback", url: "/caseback" },
    ]);

    expect(layout.primary?.id).toBe("dial");
    expect(layout.secondary?.id).toBe("caseback");
    expect(layout.tertiary).toBeUndefined();
  });

  it("leaves unused wells empty when only one photo was uploaded", () => {
    const layout = heroPhotoLayout([
      { id: "only", claimedType: "bracelet", url: "/only" },
    ]);

    expect(layout.primary?.id).toBe("only");
    expect(layout.secondary).toBeUndefined();
    expect(layout.tertiary).toBeUndefined();
  });
});
