import IdPrefix, { generateId } from "@/lib/ids";
import { devices } from "@/server/db/devices/schema";
import { sql } from "drizzle-orm";
import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const biometrics = pgTable("biometrics", {
  id: varchar("id", { length: 256 })
    .primaryKey()
    .$default(() => generateId(IdPrefix.BIOMETRIC)),
  biometricId: integer("biometric_id").notNull(),
  individual: varchar("individual", { length: 256 }),
  active: boolean("active").default(true).notNull(),
  deviceId: varchar("device_id", { length: 256 })
    .notNull()
    .references(() => devices.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: integer("created_at")
    .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
    .notNull(),
  updatedAt: integer("updated_at").$onUpdate(
    () => sql`(EXTRACT(EPOCH FROM NOW()))`,
  ),
});
