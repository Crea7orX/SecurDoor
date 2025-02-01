import IdPrefix, { generateId } from "@/lib/ids";
import { sql } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const devices = pgTable("devices", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.DEVICE)),
  name: varchar("name", { length: 256 }).notNull(),
  serialId: uuid("serial_id").notNull(),
  key: varchar("key", { length: 6 }).notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  updatedAt: integer("updated_at").$onUpdate(
    () => sql`(EXTRACT(EPOCH FROM NOW()))`,
  ),
});
