import "server-only";

import { CardWithSameFingerprintError } from "@/lib/exceptions";
import IdPrefix, { generateId } from "@/lib/ids";
import { type CardCreate, type CardUpdate } from "@/lib/validations/card";
import { db } from "@/server/db";
import { cards } from "@/server/db/cards/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, eq, sql } from "drizzle-orm";

export async function cardInsert(create: CardCreate, userId: string) {
  if (await cardFindByFingerprint(create.fingerprint)) {
    throw new CardWithSameFingerprintError();
  }

  const card = (
    await db
      .insert(cards)
      .values({
        id: generateId(IdPrefix.CARD),
        fingerprint: create.fingerprint.trim(),
        holder: create.holder?.trim(),
        active: create.active ?? true,
        ownerId: userId,
      })
      .returning()
  )[0];

  if (card) {
    const reference = [card.fingerprint, card.active.toString()];
    void logInsert(userId, "card.create", userId, card.id, reference);
  }

  return card;
}

export function cardsGetAll(ownerId: string) {
  return db.select().from(cards).where(eq(cards.ownerId, ownerId));
}

export async function cardGetById(id: string, ownerId: string) {
  return (
    (
      await db
        .select()
        .from(cards)
        .where(and(eq(cards.ownerId, ownerId), eq(cards.id, id)))
        .limit(1)
    )[0] ?? null
  );
}

export async function cardGetByFingerprint(
  fingerprint: string,
  ownerId: string,
) {
  return (
    (
      await db
        .select()
        .from(cards)
        .where(
          and(eq(cards.ownerId, ownerId), eq(cards.fingerprint, fingerprint)),
        )
        .limit(1)
    )[0] ?? null
  );
}

export async function cardUpdate(
  id: string,
  update: CardUpdate,
  ownerId: string,
) {
  const card = (
    await db
      .update(cards)
      .set({
        ...(typeof update.holder === "string" && {
          holder: update.holder.length > 0 ? update.holder.trim() : null,
        }),
        ...(typeof update.active === "boolean" && { active: update.active }),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(cards.ownerId, ownerId), eq(cards.id, id)))
      .returning()
  )[0];

  if (card) {
    const reference = [
      card.fingerprint,
      card.holder ?? "NULL",
      card.active.toString(),
    ];
    void logInsert(ownerId, "card.update", ownerId, card.id, reference);
  }

  return card;
}

export async function cardDelete(id: string, ownerId: string) {
  const card = (
    await db
      .delete(cards)
      .where(and(eq(cards.ownerId, ownerId), eq(cards.id, id)))
      .returning()
  )[0];

  if (card) {
    const reference = [
      card.fingerprint,
      card.holder ?? "NULL",
      card.active.toString(),
    ];
    void logInsert(ownerId, "card.delete", ownerId, card.id, reference);
  }

  return card;
}

async function cardFindByFingerprint(fingerprint: string) {
  return (
    (
      await db
        .select()
        .from(cards)
        .where(eq(cards.fingerprint, fingerprint))
        .limit(1)
    )[0] ?? null
  );
}
