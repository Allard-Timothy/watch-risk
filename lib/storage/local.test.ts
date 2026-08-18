import { describe, expect, it } from "vitest";

import {
  deleteCasePhotoFile,
  readCasePhotoFile,
  sanitizeOriginalName,
  writeCasePhotoFile,
} from "./local";

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

describe("local photo storage", () => {
  it("sanitizes original file names", () => {
    expect(sanitizeOriginalName("Dial macro.JPG")).toBe("Dial_macro");
    expect(sanitizeOriginalName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeOriginalName("")).toBe("photo");
  });

  it("writes, reads, and deletes a file under the case folder", async () => {
    const storagePath = await writeCasePhotoFile(
      "caseid1",
      "11111111-1111-4111-8111-111111111111",
      TINY_PNG,
      ".png",
      "dial.png",
    );

    expect(storagePath).toBe(
      "caseid1/11111111-1111-4111-8111-111111111111-dial.png",
    );
    expect(await readCasePhotoFile(storagePath)).toEqual(TINY_PNG);
    await deleteCasePhotoFile(storagePath);
  });

  it("rejects path traversal in case or image ids", async () => {
    await expect(
      writeCasePhotoFile("../etc", "x", TINY_PNG, ".png"),
    ).rejects.toThrow("Invalid storage path");
    await expect(
      writeCasePhotoFile("caseid1", "../secret", TINY_PNG, ".png"),
    ).rejects.toThrow("Invalid storage path");
  });
});
