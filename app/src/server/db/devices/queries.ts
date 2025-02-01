import "server-only";

import { DeviceWithSameSerialIdError } from "@/lib/exceptions";
import { generateKey } from "@/lib/keys";
import {
  type DeviceCreate,
  type DevicesGetSchema,
} from "@/lib/validations/device";
import { db } from "@/server/db";
import { devices } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

export async function deviceInsert(deviceCreate: DeviceCreate, userId: string) {
  if (await deviceGetBySerialId(deviceCreate.serialId)) {
    throw new DeviceWithSameSerialIdError();
  }

  const device = (
    await db
      .insert(devices)
      .values({
        name: deviceCreate.name,
        serialId: deviceCreate.serialId,
        key: generateKey(),
        ownerId: userId,
      })
      .returning()
  )[0];

  if (device) {
    const reference = [device.serialId, device.name];
    void logInsert(userId, "device.create", userId, device.id, reference);
  }

  return device;
}

export async function devicesGetAll(
  searchParams: DevicesGetSchema,
  ownerId: string,
) {
  try {
    const offset = (searchParams.page - 1) * searchParams.perPage;

    const where = and(
      eq(devices.ownerId, ownerId), // Only show devices for the organization
      searchParams.name && searchParams.name.trim() !== ""
        ? ilike(devices.name, `%${searchParams.name.trim()}%`)
        : undefined,
    );

    const orderBy =
      searchParams.sort.length > 0
        ? searchParams.sort.map((item) =>
            item.desc ? desc(devices[item.id]) : asc(devices[item.id]),
          )
        : [asc(devices.createdAt)];

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(devices)
        .limit(searchParams.perPage)
        .offset(offset)
        .where(where)
        .orderBy(...orderBy);

      const total = await tx
        .select({
          count: count(),
        })
        .from(devices)
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
  } catch (error) {
    return { data: [], pageCount: 0 };
  }
}

export async function deviceGetById(id: string, userId: string) {
  return (
    (
      await db
        .select()
        .from(devices)
        .where(and(eq(devices.ownerId, userId), eq(devices.id, id)))
        .limit(1)
    )[0] ?? null
  );
}

export async function deviceGetBySerialId(serialId: string) {
  return (
    (
      await db
        .select()
        .from(devices)
        .where(eq(devices.serialId, serialId))
        .limit(1)
    )[0] ?? null
  );
}
