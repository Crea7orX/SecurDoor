import "server-only";

import { ForbiddenError, NotFoundError } from "@/lib/exceptions";
import { db } from "@/server/db";
import { cardsToTags } from "@/server/db/cards-to-tags/schema";
import { cardGetById } from "@/server/db/cards/queries";
import { cards } from "@/server/db/cards/schema";
import { logInsert } from "@/server/db/logs/queries";
import { tags } from "@/server/db/tags/schema";
import { and, asc, eq, inArray } from "drizzle-orm";

interface CardTagsGetAllProps {
  id: string;
  ownerId: string;
}

export function cardTagsGetAll({ id, ownerId }: CardTagsGetAllProps) {
  return db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(cardsToTags)
    .innerJoin(
      cards,
      and(
        eq(cards.ownerId, ownerId), // Ensure ownership
        eq(cards.id, id),
      ),
    )
    .innerJoin(
      tags,
      and(
        eq(tags.ownerId, ownerId), // Ensure ownership
        eq(tags.id, cardsToTags.tagId),
      ),
    ) // Join to get tag details
    .where(eq(cardsToTags.cardId, id)) // Get tags only for the card
    .orderBy(asc(tags.name), asc(tags.createdAt));
}

interface CardTagsUpdateProps {
  id: string;
  tagIds: string[];
  userId: string;
  ownerId: string;
}

export async function cardTagsUpdate({
  id,
  tagIds,
  userId,
  ownerId,
}: CardTagsUpdateProps) {
  // Ensure card ownership
  const card = await cardGetById(id, ownerId);
  if (!card) {
    throw new NotFoundError();
  }

  // Remove duplicate tag IDs from input
  const uniqueTagIds = [...new Set(tagIds)];

  // Ensure provided tags ownership
  const ownedTags = await db
    .select({ id: tags.id })
    .from(tags)
    .where(and(eq(tags.ownerId, ownerId), inArray(tags.id, uniqueTagIds)));

  const ownedTagIds = ownedTags.map((card) => card.id);

  // Ensure requested tags ownership
  if (ownedTagIds.length !== uniqueTagIds.length) {
    throw new ForbiddenError();
  }

  // Fetch existing card-tag relationships
  const existingRelations = await db
    .select({ tagId: cardsToTags.tagId })
    .from(cardsToTags)
    .where(eq(cardsToTags.cardId, id));

  const existingTagIds = existingRelations.map((tag) => tag.tagId);

  // Identify new tag associations to insert
  const newTagIds = ownedTagIds.filter(
    (tagId) => !existingTagIds.includes(tagId),
  );

  // Identify obsolete tag associations to delete
  const toDelete = existingTagIds.filter(
    (tagId) => !ownedTagIds.includes(tagId),
  );

  // Log for card with multiple tags (only if there are changes)
  if (newTagIds.length > 0 || toDelete.length > 0) {
    void logInsert(ownerId, "card.tags_update", userId, id, [
      card.fingerprint,
      card.holder ?? "NULL",
      [...newTagIds],
      [...toDelete],
    ]);
  }

  // Insert new associations
  if (newTagIds.length > 0) {
    await db.insert(cardsToTags).values(
      newTagIds.map((tagId) => ({
        cardId: id,
        tagId,
      })),
    );
  }

  // Delete removed associations
  if (toDelete.length > 0) {
    await db
      .delete(cardsToTags)
      .where(
        and(eq(cardsToTags.cardId, id), inArray(cardsToTags.tagId, toDelete)),
      );
  }

  return [newTagIds, toDelete];
}
