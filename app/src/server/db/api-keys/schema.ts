import IdPrefix, { generateId } from "@/lib/ids";
import { sql } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const apiKeys = pgTable("api_keys", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.API_KEY)),
  name: varchar("name", { length: 256 }).notNull(),
  key: varchar("key", { length: 256 }).notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  lastUsedAt: integer("last_used_at"),
});
