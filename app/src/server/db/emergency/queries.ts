import "server-only";
import { db } from "@/server/db";
import { devicesToTags } from "@/server/db/devices-to-tags/schema";
import { devices, type emergencyStateEnum } from "@/server/db/devices/schema";
import { logInsert, logInsertMultiple } from "@/server/db/logs/queries";
import { and, count, eq, inArray, isNotNull, sql } from "drizzle-orm";

export async function emergencyStateGetById(deviceId: string, ownerId: string) {
  return (
    await db
      .select({
        id: devices.id,
        emergencyState: devices.emergencyState,
      })
      .from(devices)
      .where(
        and(
          eq(devices.ownerId, ownerId), // Ensure ownership
          eq(devices.id, deviceId),
        ),
      )
      .limit(1)
  )[0];
}

export async function emergencyStateSetDevice(
  deviceId: string,
  state: (typeof emergencyStateEnum.enumValues)[number] | null,
  userId: string,
  ownerId: string,
) {
  const device = (
    await db
      .update(devices)
      .set({
        emergencyState: state,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(
        and(
          eq(devices.ownerId, ownerId), // Ensure ownership
          eq(devices.id, deviceId),
        ),
      )
      .returning({
        id: devices.id,
        name: devices.name,
        serialId: devices.serialId,
        emergencyState: devices.emergencyState,
      })
  )[0];

  if (device) {
    const reference = [
      device.serialId,
      device.name,
      device.emergencyState ?? "clear",
    ];
    void logInsert(
      ownerId,
      "device.emergency_state",
      userId,
      device.id,
      reference,
    );
  }

  return device;
}

interface EmergencyStateSetDevicesParams {
  deviceIds: string[];
  tagIds: string[];
  state: (typeof emergencyStateEnum.enumValues)[number] | null;
  userId: string;
  ownerId: string;
}

export async function emergencyStateSetDevices({
  deviceIds,
  tagIds,
  state,
  userId,
  ownerId,
}: EmergencyStateSetDevicesParams) {
  const taggedDeviceIds =
    tagIds.length > 0
      ? (
          await db
            .select({ deviceId: devicesToTags.deviceId })
            .from(devicesToTags)
            .innerJoin(devices, eq(devices.id, devicesToTags.deviceId))
            .where(
              and(
                eq(devices.ownerId, ownerId), // Ensure ownership
                inArray(devicesToTags.tagId, tagIds),
              ),
            )
        ).map((row) => row.deviceId)
      : [];

  // Remove duplicates
  const allTargetDeviceIds = Array.from(
    new Set([...deviceIds, ...taggedDeviceIds]),
  );

  // If no devices to update, return early
  if (allTargetDeviceIds.length === 0) return [];

  const _devices = await db
    .update(devices)
    .set({
      emergencyState: state,
      updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
    })
    .where(
      and(
        eq(devices.ownerId, ownerId), // Ensure ownership
        inArray(devices.id, allTargetDeviceIds),
      ),
    )
    .returning({
      id: devices.id,
      name: devices.name,
      serialId: devices.serialId,
      emergencyState: devices.emergencyState,
    });

  if (_devices.length > 0) {
    const logs = _devices.map((device) => ({
      action: "device.emergency_state",
      objectId: device.id,
      reference: [
        device.serialId,
        device.name,
        device.emergencyState ?? "clear",
      ],
    }));

    void logInsertMultiple(ownerId, logs, userId);
  }

  return _devices;
}

export async function emergencyStatesGetCount(ownerId: string) {
  return await db
    .select({
      state: devices.emergencyState,
      count: count(),
    })
    .from(devices)
    .groupBy(devices.emergencyState)
    .where(
      and(
        eq(devices.ownerId, ownerId), // Ensure ownership
        isNotNull(devices.emergencyState),
      ),
    )
    .then((res) =>
      res.reduce(
        (acc, { state, count }) => {
          // filter out null state in where clause
          acc[state!] = count;
          return acc;
        },
        {} as Record<(typeof emergencyStateEnum.enumValues)[number], number>,
      ),
    );
}
