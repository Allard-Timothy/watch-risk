import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgresql://watchrisk:watchrisk@localhost:5432/watchrisk?schema=public",
    },
  },
});
