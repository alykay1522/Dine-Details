import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.POSTGRES_PRISMA_URL?.trim() ||
  process.env.POSTGRES_URL_NON_POOLING?.trim();

const missingDatabaseError =
  "DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?";

const ssl =
  !connectionString ||
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1")
    ? undefined
    : { rejectUnauthorized: false };

export const pool = connectionString
  ? new Pool({ connectionString, ssl })
  : undefined;

const missingDb = new Proxy(
  {},
  {
    get() {
      throw new Error(missingDatabaseError);
    },
  },
) as ReturnType<typeof drizzle>;

export const db = connectionString ? drizzle(pool, { schema }) : missingDb;

export * from "./schema";
