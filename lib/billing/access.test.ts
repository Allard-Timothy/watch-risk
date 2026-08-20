import { afterEach, describe, expect, it, vi } from "vitest";

import { canAccessExplorers, canGenerateReport } from "./access";

describe("canAccessExplorers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows access in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const result = await canAccessExplorers(undefined);
    expect(result.allowed).toBe(true);
  });

  it("allows access when mock payments are enabled", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PAYMENTS_MODE", "mock");
    const result = await canAccessExplorers(undefined);
    expect(result.allowed).toBe(true);
  });
});

describe("canGenerateReport", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows report generation in mock mode", async () => {
    vi.stubEnv("PAYMENTS_MODE", "mock");
    const result = await canGenerateReport({
      userId: undefined,
      caseUserId: null,
      caseStatus: "DRAFT",
    });
    expect(result.allowed).toBe(true);
  });

  it("blocks unauthenticated users in production billing mode", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PAYMENTS_MODE", "stripe");
    const result = await canGenerateReport({
      userId: undefined,
      caseUserId: null,
      caseStatus: "DRAFT",
    });
    expect(result.allowed).toBe(false);
  });
});
