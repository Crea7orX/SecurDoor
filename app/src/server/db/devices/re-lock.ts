import "server-only";

import { deviceSetLocked } from "@/server/db/devices/queries";

// Map to store active re-lock timeouts
const reLockTimeouts = new Map<string, NodeJS.Timeout>();

interface scheduleReLockProps {
  deviceId: string;
  userId: string;
  ownerId: string;
  delay: number;
}

export async function scheduleReLock({
  deviceId,
  userId,
  ownerId,
  delay,
}: scheduleReLockProps) {
  if (delay <= 0) return;

  // Cancel any existing re-lock timer for this device
  cancelScheduledReLock({ deviceId });

  // Schedule a new re-lock timeout
  const timeout = setTimeout(
    () =>
      void (async () => {
        reLockTimeouts.delete(deviceId);
        void deviceSetLocked({
          id: deviceId,
          userId,
          ownerId,
          isLocked: true,
          autoLock: true,
        });
      })(),
    delay * 1000,
  );

  // Store the timeout reference so we can cancel it if needed
  reLockTimeouts.set(deviceId, timeout);
}

interface cancelScheduledReLockProps {
  deviceId: string;
}

export function cancelScheduledReLock({
  deviceId,
}: cancelScheduledReLockProps) {
  const timeout = reLockTimeouts.get(deviceId);

  if (timeout) {
    clearTimeout(timeout);
    reLockTimeouts.delete(deviceId);
  }
}
