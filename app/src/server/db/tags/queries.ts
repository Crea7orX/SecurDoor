import "server-only";
import {
  type TagCreate,
  type TagsGetSchema,
  type TagUpdate,
} from "@/lib/validations/tag";
import { db } from "@/server/db";
import { logInsert } from "@/server/db/logs/queries";
import { tags } from "@/server/db/tags/schema";
import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";

interface TagInsertProps {
  create: TagCreate;
  userId: string;
  ownerId: string;
}

export async function tagInsert({ create, userId, ownerId }: TagInsertProps) {
  const tag = (
    await db
      .insert(tags)
      .values({
        name: create.name.trim(),
        ownerId,
      })
      .returning()
  )[0];

  if (tag) {
    const reference = [tag.name];
    void logInsert(ownerId, "tag.create", userId, tag.id, reference);
  }

  return tag;
}

interface TagsGetAllProps {
  searchParams: TagsGetSchema;
  ownerId: string;
}

export async function tagsGetAll({ searchParams, ownerId }: TagsGetAllProps) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(tags.ownerId, ownerId), // Ensure ownership
      searchParams.name && searchParams.name.trim() !== ""
        ? ilike(tags.name, `%${searchParams.name.trim()}%`)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(tags[item.id]) : asc(tags[item.id]),
          )
        : [desc(tags.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(tags)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(tags)
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

interface TagUpdateProps {
  id: string;
  update: TagUpdate;
  userId: string;
  ownerId: string;
}

export async function tagUpdate({
  id,
  update,
  userId,
  ownerId,
}: TagUpdateProps) {
  const tag = (
    await db
      .update(tags)
      .set({
        ...(typeof update.name === "string" && {
          name: update.name.trim(),
        }),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(tags.ownerId, ownerId), // Ensure ownership
          eq(tags.id, id),
        ),
      )
      .returning()
  )[0];

  if (tag) {
    const reference = [tag.name];
    if (typeof update.name === "string") {
      void logInsert(ownerId, "tag.rename", userId, tag.id, reference);
    }
  }

  return tag;
}

interface TagDeleteProps {
  id: string;
  userId: string;
  ownerId: string;
}

export async function tagDelete({ id, userId, ownerId }: TagDeleteProps) {
  const tag = (
    await db
      .delete(tags)
      .where(
        and(
          eq(tags.ownerId, ownerId), // Ensure ownership
          eq(tags.id, id),
        ),
      )
      .returning()
  )[0];

  if (tag) {
    const reference = [tag.name];
    void logInsert(ownerId, "tag.delete", userId, tag.id, reference);
  }

  return tag;
}
