import "server-only";

import { CardWithSameFingerprintError } from "@/lib/exceptions";
import {
  type CardCreate,
  type CardsGetSchema,
  type CardUpdate,
} from "@/lib/validations/card";
import { db } from "@/server/db";
import { cards } from "@/server/db/cards/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

export async function cardInsert(
  create: CardCreate,
  userId: string,
  ownerId: string,
) {
  if (await cardGetByFingerprint(create.fingerprint, ownerId)) {
    throw new CardWithSameFingerprintError();
  }

  const card = (
    await db
      .insert(cards)
      .values({
        fingerprint: create.fingerprint.trim(),
        holder: create.holder?.trim(),
        active: create.active ?? true,
        ownerId,
      })
      .returning()
  )[0];

  if (card) {
    const reference = [card.fingerprint, card.active.toString()];
    void logInsert(ownerId, "card.create", userId, card.id, reference);
  }

  return card;
}

export async function cardsGetAll(
  searchParams: CardsGetSchema,
  ownerId: string,
) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(cards.ownerId, ownerId), // Only show cards for the organization
      searchParams.holder && searchParams.holder.trim() !== ""
        ? ilike(cards.holder, `%${searchParams.holder.trim()}%`)
        : undefined,
      searchParams.active && searchParams.active.length > 0
        ? inArray(cards.active, searchParams.active)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(cards[item.id]) : asc(cards[item.id]),
          )
        : [asc(cards.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(cards)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(cards)
        .where(where)
        .execute()
        .then((res) => res[0]?.count ?? 0);

      return {
        data,
        total,
      };
    });

    const pageCount = Math.ceil(total / searchParams.perPage);
    return { data, pageCount };
  } catch {
    return { data: [], pageCount: 0 };
  }
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
  userId: string,
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
    if (typeof update.holder === "string") {
      const reference = [card.fingerprint, card.holder ?? "NULL"];
      void logInsert(ownerId, "card.rename", userId, card.id, reference);
    }

    if (typeof update.active === "boolean") {
      const reference = [card.fingerprint, card.active.toString()];
      void logInsert(
        ownerId,
        card.active ? "card.activate" : "card.deactivate",
        userId,
        card.id,
        reference,
      );
    }
  }

  return card;
}

export async function cardDelete(id: string, userId: string, ownerId: string) {
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
    void logInsert(ownerId, "card.delete", userId, card.id, reference);
  }

  return card;
}
