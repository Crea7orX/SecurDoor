import "server-only";

import { ForbiddenError } from "@/lib/exceptions";
import { db } from "@/server/db";
import { biometrics } from "@/server/db/biometrics/schema";
import { cardsToDevices } from "@/server/db/cards-to-devices/schema";
import { cardsToTags } from "@/server/db/cards-to-tags/schema";
import { cards } from "@/server/db/cards/schema";
import { deviceStateHeartbeatUpdate } from "@/server/db/devices-states/queries";
import { devicesToTags } from "@/server/db/devices-to-tags/schema";
import { type deviceGetBySerialIdUnprotected } from "@/server/db/devices/queries";
import { devices } from "@/server/db/devices/schema";
import { logInsert, logInsertMultiple } from "@/server/db/logs/queries";
import { and, eq, sql } from "drizzle-orm";

interface accessCardTryAuthenticationProps {
  ownerId: string;
  device: NonNullable<
    Awaited<ReturnType<typeof deviceGetBySerialIdUnprotected>>
  >;
  deviceId: string;
  fingerprint: string;
}

export async function accessCardTryAuthentication({
  ownerId,
  device,
  deviceId,
  fingerprint,
}: accessCardTryAuthenticationProps) {
  void deviceStateHeartbeatUpdate({ deviceId }); // Update device heartbeat

  // Try direct access
  const directAccess = (
    await db
      .select()
      .from(cards)
      .innerJoin(cardsToDevices, eq(cards.id, cardsToDevices.cardId))
      .where(
        and(
          eq(cards.ownerId, ownerId), // Ensure ownership
          eq(cards.fingerprint, fingerprint),
          eq(cardsToDevices.deviceId, deviceId),
        ),
      )
      .limit(1)
  )[0];

  // Try tag-based access
  const tagBasedAccess = (
    await db
      .select()
      .from(cards)
      .innerJoin(cardsToTags, eq(cards.id, cardsToTags.cardId))
      .innerJoin(devicesToTags, eq(cardsToTags.tagId, devicesToTags.tagId))
      .where(
        and(
          eq(cards.ownerId, ownerId), // Ensure ownership
          eq(cards.fingerprint, fingerprint),
          eq(devicesToTags.deviceId, deviceId),
        ),
      )
      .limit(1)
  )[0];

  // Get the card info from either access method
  const access = directAccess ?? tagBasedAccess;

  if (!access) {
    const reference = [device.serialId, device.name, fingerprint];
    void logInsert(
      ownerId,
      "device.access_denied",
      "system",
      deviceId,
      reference,
    );
    throw new ForbiddenError();
  }

  const card = access.cards;

  if (device.emergencyState || !card.active) throw new ForbiddenError();

  const cardRef = [
    card.fingerprint,
    card.holder ?? "NULL",
    device.serialId,
    device.name,
  ];

  const deviceRef = [
    device.serialId,
    device.name,
    "card",
    card.fingerprint,
    card.holder ?? "NULL",
  ];

  // Update device locked state
  if (device.isLocked) {
    await db
      .update(devices)
      .set({
        isLocked: false,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)));
  } else {
    await db
      .update(devices)
      .set({
        isLocked: true,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)));
  }

  // Log access
  void logInsertMultiple(
    ownerId,
    [
      {
        action: device.isLocked ? "device.unlock" : "device.lock",
        objectId: deviceId,
        reference: deviceRef,
      },
      {
        action: device.isLocked ? "card.unlock" : "card.lock",
        objectId: card.id,
        reference: cardRef,
      },
    ],
    "system",
  );

  return {
    isLocked: !device.isLocked,
    reLockDelay: device.reLockDelay,
    holder: card.holder,
  };
}

interface accessBiometricTryAuthenticationProps {
  ownerId: string;
  device: NonNullable<
    Awaited<ReturnType<typeof deviceGetBySerialIdUnprotected>>
  >;
  deviceId: string;
  biometricId: number;
}

export async function accessBiometricTryAuthentication({
  ownerId,
  device,
  deviceId,
  biometricId,
}: accessBiometricTryAuthenticationProps) {
  void deviceStateHeartbeatUpdate({ deviceId }); // Update device heartbeat

  // Try biometric access
  const biometric = (
    await db
      .select()
      .from(biometrics)
      .where(
        and(
          eq(biometrics.ownerId, ownerId), // Ensure ownership
          eq(biometrics.biometricId, biometricId),
          eq(biometrics.deviceId, deviceId),
        ),
      )
      .limit(1)
  )[0];

  if (!biometric) {
    const reference = [device.serialId, device.name, biometricId];
    void logInsert(
      ownerId,
      "device.access_denied_biometric",
      "system",
      deviceId,
      reference,
    );
    throw new ForbiddenError();
  }

  if (device.emergencyState || !biometric.active) throw new ForbiddenError();

  const deviceRef = [
    device.serialId,
    device.name,
    "bio",
    biometric.biometricId,
    biometric.individual ?? "NULL",
  ];

  const biometricRef = [
    biometric.biometricId,
    biometric.individual ?? "NULL",
    device.serialId,
    device.name,
  ];

  // Update device locked state
  if (device.isLocked) {
    await db
      .update(devices)
      .set({
        isLocked: false,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)));
  } else {
    await db
      .update(devices)
      .set({
        isLocked: true,
        updatedAt: sql`(EXTRACT(EPOCH FROM NOW()))`,
      })
      .where(and(eq(devices.ownerId, ownerId), eq(devices.id, deviceId)));
  }

  // Log access
  void logInsertMultiple(
    ownerId,
    [
      {
        action: device.isLocked ? "device.unlock" : "device.lock",
        objectId: deviceId,
        reference: deviceRef,
      },
      {
        action: device.isLocked ? "biometric.unlock" : "biometric.lock",
        objectId: biometric.id,
        reference: biometricRef,
      },
    ],
    "system",
  );

  return {
    isLocked: !device.isLocked,
    reLockDelay: device.reLockDelay,
    individual: biometric.individual,
  };
}
