import { PrismaClient } from "@prisma/client";

/**
 * Placeholder database client module.
 *
 * `lib/db` owns the Prisma client (docs/architecture-typescript.md). This step
 * defines the client but does NOT wire a real database: no migrations have been
 * run and nothing in the app queries it yet. The client is created lazily, so
 * importing this module never opens a connection. A connection is only attempted
 * on the first query, which requires a valid `DATABASE_URL`.
 */

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient();
}

/**
 * Returns a singleton Prisma client. Reused across hot reloads in development to
 * avoid exhausting database connections.
 */
export function getDbClient(): PrismaClient {
  const client = globalForPrisma.prisma ?? createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  return client;
}
