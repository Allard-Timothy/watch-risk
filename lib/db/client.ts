import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton for WatchTell.
 *
 * `lib/db` owns database access (docs/reference/architecture-typescript.md). The client is
 * created lazily so importing this module never opens a connection. The first
 * query requires `DATABASE_URL`. Reused across hot reloads in development to
 * avoid exhausting connections.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

export function getDbClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}
