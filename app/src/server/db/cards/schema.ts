import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const cards = pgTable("cards", {
  id: varchar("id", { length: 256 }).primaryKey(),
  fingerprint: varchar("fingerprint", { length: 32 }).notNull(),
  holder: varchar("holder", { length: 256 }),
  active: boolean("active").default(true).notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  updatedAt: integer("updated_at").$onUpdate(
    () => sql`(EXTRACT(EPOCH FROM NOW()))`,
  ),
});
