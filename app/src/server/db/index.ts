import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Schemas
import * as apiKeys from "./api-keys/schema";
import * as cards from "./cards/schema";
import * as devices from "./devices/schema";
import * as logs from "./logs/schema";
import * as cardsToDevices from "./cards-to-devices/schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...apiKeys,
    ...cards,
    ...devices,
    ...logs,
    ...cardsToDevices,
  },
});
