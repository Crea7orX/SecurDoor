import { apiSignedResponseSchema } from "@/lib/validations/api-signed";
import {
  emergencyStateEnum,
  pendingCommandEnum,
} from "@/server/db/devices/schema";
import { z } from "zod";

export const deviceHeartbeatSchema = z.object({
  isLockedState: z.boolean(),
  doorState: z.boolean().optional(),
});

export type DeviceHeartbeat = z.infer<typeof deviceHeartbeatSchema>;

export const deviceHeartbeatResponseSchema = z.object({
  isLocked: z.boolean(),
  emergencyState: z.enum(emergencyStateEnum.enumValues).nullable(),
  pendingCommand: z.enum(pendingCommandEnum.enumValues).nullable(),
  ...apiSignedResponseSchema.shape,
});

export type DeviceHeartbeatResponse = z.infer<
  typeof deviceHeartbeatResponseSchema
>;
