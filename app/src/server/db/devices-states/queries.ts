import "server-only";

import { DeviceNotForAdoptionError, NotFoundError } from "@/lib/exceptions";
import { type DeviceHeartbeat } from "@/lib/validations/device-heartbeat";
import { db } from "@/server/db";
import { devicesStates } from "@/server/db/devices-states/schema";
import { deviceGetById } from "@/server/db/devices/queries";
import { devices } from "@/server/db/devices/schema";
import { logInsert } from "@/server/db/logs/queries";
import { and, eq, sql } from "drizzle-orm";

interface DeviceStateInsertParams {
  deviceId: string;
  ownerId: string;
}

export async function deviceStateInsert({
  deviceId,
  ownerId,
}: DeviceStateInsertParams) {
  const deviceStatus = (
    await db
      .insert(devicesStates)
      .values({
        deviceId,
      })
      .returning()
  )[0];

  const reference = [deviceId];
  void logInsert(
    ownerId,
    "device_status.pending_adoption",
    "system",
    deviceId,
    reference,
  );

  return deviceStatus;
}

interface DeviceStartAdoptionParams {
  deviceId: string;
  ownerId: string;
}

export async function deviceStartAdoption({
  deviceId,
  ownerId,
}: DeviceStartAdoptionParams) {
  const deviceStatus = (
    await db
      .update(devicesStates)
      .set({
        status: "adopting",
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devicesStates.deviceId, deviceId)))
      .returning()
  )[0];

  if (deviceStatus) {
    const reference = [deviceId];
    void logInsert(
      ownerId,
      "device_status.adopting",
      "system",
      deviceId,
      reference,
    );
  }

  return deviceStatus;
}

interface DeviceAdoptParams {
  deviceId: string;
  ownerId: string;
}

export async function deviceAdopt({ deviceId, ownerId }: DeviceAdoptParams) {
  // check if device is in pending adoption status
  const deviceStatus = await deviceStateGetByDeviceIdUnprotected(deviceId);
  if (!deviceStatus) {
    throw new NotFoundError();
  }

  if (deviceStatus.status !== "adopting") {
    throw new DeviceNotForAdoptionError();
  }

  // adopt device
  const deviceStatusUpdated = (
    await db
      .update(devicesStates)
      .set({
        status: "adopted",
        lastSeenAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devicesStates.deviceId, deviceId)))
      .returning()
  )[0];

  if (deviceStatusUpdated) {
    const reference = [deviceId];
    void logInsert(
      ownerId,
      "device_status.adopted",
      "system",
      deviceId,
      reference,
    );
  }

  return deviceStatusUpdated;
}

interface DeviceStateGetByDeviceIdParams {
  deviceId: string;
  ownerId: string;
}

export async function deviceStateGetByDeviceId({
  deviceId,
  ownerId,
}: DeviceStateGetByDeviceIdParams) {
  return (
    await db
      .select({
        id: devicesStates.deviceId,
        status: devicesStates.status,
        isLocked: devicesStates.isLocked,
        isLockedState: devicesStates.isLockedState,
        lastSeenAt: devicesStates.lastSeenAt,
        updatedAt: devicesStates.updatedAt,
      })
      .from(devicesStates)
      .innerJoin(
        devices,
        and(
          eq(devices.ownerId, ownerId), // Ensure device ownership
          eq(devices.id, deviceId),
        ),
      )
      .where(and(eq(devicesStates.deviceId, deviceId)))
      .limit(1)
  )[0];
}

export async function deviceStateGetByDeviceIdUnprotected(deviceId: string) {
  return (
    await db
      .select()
      .from(devicesStates)
      .where(eq(devicesStates.deviceId, deviceId))
      .limit(1)
  )[0];
}

interface DeviceStateHeartbeatParams {
  deviceId: string;
  ownerId: string;
  heartbeat: DeviceHeartbeat;
}

export async function deviceStateHeartbeat({
  deviceId,
  ownerId,
  heartbeat,
}: DeviceStateHeartbeatParams) {
  const deviceStateUpdated = (
    await db
      .update(devicesStates)
      .set({
        isLockedState: heartbeat.isLockedState,
        lastSeenAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devicesStates.deviceId, deviceId)))
      .returning()
  )[0];

  const device = await deviceGetById(deviceId, ownerId);
  if (!device) {
    throw new NotFoundError();
  }

  return {
    ...device,
    ...deviceStateUpdated,
  };
}
