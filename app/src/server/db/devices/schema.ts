import IdPrefix, { generateId } from "@/lib/ids";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const emergencyStateEnum = pgEnum("emergency_state", [
  "lockdown",
  "evacuation",
]);

export const devices = pgTable("devices", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.DEVICE)),
  name: varchar("name", { length: 256 }).notNull(),
  serialId: uuid("serial_id").notNull(),
  key: varchar("key", { length: 6 }).notNull(),
  reLockDelay: integer("re_lock_delay").notNull().default(5),
  isLocked: boolean("is_locked").notNull().default(true),
  emergencyState: emergencyStateEnum("emergency_state"),
  publicKey: text("public_key"),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  updatedAt: integer("updated_at").$onUpdate(
    () => sql`(EXTRACT(EPOCH FROM NOW()))`,
  ),
});
