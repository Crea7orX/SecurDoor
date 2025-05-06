import "server-only";

import { BiometricWithSameBiometricIdError } from "@/lib/exceptions";
import {
  type BiometricCreate,
  type BiometricsGetSchema,
  type BiometricUpdate,
} from "@/lib/validations/biometric";
import { db } from "@/server/db";
import { biometrics } from "@/server/db/biometrics/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";

interface BiometricInsertProps {
  create: BiometricCreate;
  deviceId: string;
  userId: string;
  ownerId: string;
}

export async function biometricInsert({
  create,
  deviceId,
  userId,
  ownerId,
}: BiometricInsertProps) {
  const biometricByBiometricId = await biometricGetByBiometricId({
    biometricId: create.biometricId,
    ownerId,
  });
  if (biometricByBiometricId) {
    throw new BiometricWithSameBiometricIdError(biometricByBiometricId.id);
  }

  const biometric = (
    await db
      .insert(biometrics)
      .values({
        biometricId: create.biometricId,
        individual: create.individual?.trim(),
        active: create.active ?? true,
        deviceId,
        ownerId,
      })
      .returning()
  )[0];

  if (biometric) {
    const reference = [
      biometric.biometricId,
      biometric.individual ?? "NULL",
      biometric.active,
    ];
    void logInsert(
      ownerId,
      "biometric.create",
      userId,
      biometric.id,
      reference,
    );
  }

  return biometric;
}

interface BiometricsGetAllProps {
  searchParams: BiometricsGetSchema;
  ownerId: string;
}

export async function biometricsGetAll({
  searchParams,
  ownerId,
}: BiometricsGetAllProps) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(biometrics.ownerId, ownerId), // Ensure ownership
      searchParams.individual && searchParams.individual.trim() !== ""
        ? ilike(biometrics.individual, `%${searchParams.individual.trim()}%`)
        : undefined,
      searchParams.active && searchParams.active.length > 0
        ? inArray(biometrics.active, searchParams.active)
        : undefined,
      searchParams.deviceId && searchParams.deviceId.length > 0
        ? inArray(biometrics.deviceId, searchParams.deviceId)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(biometrics[item.id]) : asc(biometrics[item.id]),
          )
        : [desc(biometrics.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(biometrics)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(biometrics)
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

interface BiometricGetByIdProps {
  id: string;
  ownerId: string;
}

export async function biometricGetById({ id, ownerId }: BiometricGetByIdProps) {
  return (
    (
      await db
        .select()
        .from(biometrics)
        .where(
          and(
            eq(biometrics.ownerId, ownerId), // Ensure ownership
            eq(biometrics.id, id),
          ),
        )
        .limit(1)
    )[0] ?? null
  );
}

interface BiometricGetByBiometricId {
  biometricId: number;
  ownerId: string;
}

export async function biometricGetByBiometricId({
  biometricId,
  ownerId,
}: BiometricGetByBiometricId) {
  return (
    (
      await db
        .select()
        .from(biometrics)
        .where(
          and(
            eq(biometrics.ownerId, ownerId), // Ensure ownership
            eq(biometrics.biometricId, biometricId),
          ),
        )
        .limit(1)
    )[0] ?? null
  );
}

interface BiometricUpdateProps {
  id: string;
  update: BiometricUpdate;
  userId: string;
  ownerId: string;
}

export async function biometricUpdate({
  id,
  update,
  userId,
  ownerId,
}: BiometricUpdateProps) {
  const biometric = (
    await db
      .update(biometrics)
      .set({
        ...(typeof update.individual === "string" && {
          individual:
            update.individual.length > 0 ? update.individual.trim() : null,
        }),
        ...(typeof update.active === "boolean" && { active: update.active }),
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(biometrics.ownerId, ownerId), // Ensure ownership
          eq(biometrics.id, id),
        ),
      )
      .returning()
  )[0];

  if (biometric) {
    const reference = [biometric.biometricId, biometric.individual ?? "NULL"];
    if (typeof update.individual === "string") {
      void logInsert(
        ownerId,
        "biometric.rename",
        userId,
        biometric.id,
        reference,
      );
    }

    if (typeof update.active === "boolean") {
      void logInsert(
        ownerId,
        biometric.active ? "biometric.activate" : "biometric.deactivate",
        userId,
        biometric.id,
        reference,
      );
    }
  }

  return biometric;
}

interface BiometricDeleteProps {
  id: string;
  userId: string;
  ownerId: string;
}

export async function biometricDelete({
  id,
  userId,
  ownerId,
}: BiometricDeleteProps) {
  const biometric = (
    await db
      .delete(biometrics)
      .where(
        and(
          eq(biometrics.ownerId, ownerId), // Ensure ownership
          eq(biometrics.id, id),
        ),
      )
      .returning()
  )[0];

  if (biometric) {
    const reference = [
      biometric.biometricId,
      biometric.individual ?? "NULL",
      biometric.active,
    ];
    void logInsert(
      ownerId,
      "biometric.delete",
      userId,
      biometric.id,
      reference,
    );
  }

  return biometric;
}
