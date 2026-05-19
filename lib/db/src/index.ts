import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.POSTGRES_PRISMA_URL?.trim() ||
  process.env.POSTGRES_URL_NON_POOLING?.trim();

if (!connectionString) {
  throw new Error(
    "DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING must be set. Did you forget to provision a database?",
  );
}

const ssl =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1")
    ? undefined
    : { rejectUnauthorized: false };

export const pool = new Pool({ connectionString, ssl });
export const db = drizzle(pool, { schema });

export * from "./schema";
