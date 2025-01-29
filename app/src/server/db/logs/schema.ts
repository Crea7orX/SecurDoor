import { sql } from "drizzle-orm";
import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: varchar("id", { length: 256 }).primaryKey(),
  action: varchar("action", { length: 256 }).notNull(),
  actorName: varchar("actor_name", { length: 1024 }),
  actorEmail: varchar("actor_email", { length: 1024 }),
  actorId: varchar("actor_id", { length: 256 }).notNull(),
  objectId: varchar("object_id", { length: 256 }),
  reference: text("reference")
    .array()
    .default(sql`ARRAY[]::text[]`),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
});
