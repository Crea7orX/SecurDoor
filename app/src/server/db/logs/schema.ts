import IdPrefix, { generateId } from "@/lib/ids";
import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, varchar } from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.LOG)),
  action: varchar("action", { length: 256 }).notNull(),
  actorName: varchar("actor_name", { length: 1024 }),
  actorEmail: varchar("actor_email", { length: 1024 }),
  actorId: varchar("actor_id", { length: 256 }).notNull(),
  objectId: varchar("object_id", { length: 256 }),
  reference: jsonb("reference"),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
});
