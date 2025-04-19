import { cards } from "@/server/db/cards/schema";
import { tags } from "@/server/db/tags/schema";
import { sql } from "drizzle-orm";
import { integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";

export const cardsToTags = pgTable(
  "cards_to_tags",
  {
    cardId: varchar("card_id", { length: 256 })
      .notNull()
      .references(() => cards.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    tagId: varchar("tag_id", { length: 256 })
      .notNull()
      .references(() => tags.id, {
        onUpdate: "cascade",
        onDelete: "cascade",
      }),
    createdAt: integer("created_at")
      .default(sql`(EXTRACT(EPOCH FROM NOW()))`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cardId, table.tagId] }),
  }),
);
