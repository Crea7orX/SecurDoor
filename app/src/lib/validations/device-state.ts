import { deviceStatusEnum } from "@/server/db/devices-states/schema";
import { z } from "zod";

export const deviceStateResponseSchema = z.object({
  id: z.string(),
  status: z.enum(deviceStatusEnum.enumValues),
  isLocked: z.boolean(),
  lastSeenAt: z.number().nullable(),
  updatedAt: z.number(),
});

export type DeviceStateResponse = z.infer<typeof deviceStateResponseSchema>;
