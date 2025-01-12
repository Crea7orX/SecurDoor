import "server-only";

import { CardWithSameFingerprintError } from "@/lib/exceptions";
import IdPrefix, { generateId } from "@/lib/ids";
import { CardCreate, CardUpdate } from "@/lib/validations/card";
import { db } from "@/server/db";
import { cards } from "@/server/db/cards/schema";
import { and, eq, sql } from "drizzle-orm";

export async function cardInsert(create: CardCreate, userId: string) {
  if (await cardFindByFingerprint(create.fingerprint)) {
    throw new CardWithSameFingerprintError();
  }

  return (
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
  return (
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
}

export async function cardDelete(id: string, ownerId: string) {
  return (
    await db
      .delete(cards)
      .where(and(eq(cards.ownerId, ownerId), eq(cards.id, id)))
      .returning()
  )[0];
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
