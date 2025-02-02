import { cards } from "@/server/db/cards/schema";
import { devices } from "@/server/db/devices/schema";
import { sql } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const cardsToDevices = pgTable(
  "cards_to_devices",
  {
    cardId: varchar("card_id", { length: 256 })
      .notNull()
      .references(() => cards.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    deviceId: varchar("device_id", { length: 256 })
      .notNull()
      .references(() => devices.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: integer("created_at")
      .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cardId, table.deviceId] }),
  }),
);
