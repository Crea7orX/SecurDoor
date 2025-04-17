import "server-only";
import { UnauthorizedError } from "@/lib/exceptions";
import IdPrefix, { generateId } from "@/lib/ids";
import { type ApiKeyCreate } from "@/lib/validations/api-key";
import { db } from "@/server/db";
import { apiKeys } from "@/server/db/api-keys/schema";
import { logInsert } from "@/server/db/logs/queries";
import { asc, desc, eq, sql } from "drizzle-orm";

interface ApiKeyInsertProps {
  create: ApiKeyCreate;
  userId: string;
  ownerId: string;
}

export async function apiKeyInsert({
  create,
  userId,
  ownerId,
}: ApiKeyInsertProps) {
  const apiKey = (
    await db
      .insert(apiKeys)
      .values({
        name: create.name?.trim(),
        key: generateId(IdPrefix.PRIVATE_KEY, 128),
        ownerId,
      })
      .returning()
  )[0];

  if (apiKey) {
    const reference = [apiKey.name];
    void logInsert(ownerId, "api_key.create", userId, apiKey.id, reference);
  }

  return apiKey;
}

interface ApiKeysGetAllProps {
  ownerId: string;
}

export async function apiKeysGetAll({ ownerId }: ApiKeysGetAllProps) {
  return db
    .select()
    .from(apiKeys)
    .where(
      eq(apiKeys.ownerId, ownerId), // Ensure ownership
    )
    .orderBy(asc(apiKeys.name), desc(apiKeys.createdAt));
}

interface ApiKeyVerifyProps {
  apiKey: string;
}

export async function apiKeyVerify({ apiKey }: ApiKeyVerifyProps) {
  const apiKeyRecord = (
    await db
      .update(apiKeys)
      .set({
        lastUsedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(eq(apiKeys.key, apiKey))
      .returning()
  )[0];

  if (!apiKeyRecord) {
    throw new UnauthorizedError();
  }

  return apiKeyRecord;
}
