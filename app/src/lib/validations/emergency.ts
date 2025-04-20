import { deviceBulkSchema } from "@/lib/validations/device";
import { tagBulkSchema } from "@/lib/validations/tag";
import { emergencyStateEnum } from "@/server/db/devices/schema";
import { z } from "zod";

export const emergencyResponseSchema = z.object({
  id: z.string(),
  state: z.enum(emergencyStateEnum.enumValues).nullable(),
});

export type EmergencyResponse = z.infer<typeof emergencyResponseSchema>;

export const emergencyUpdateSchema = z.object({
  state: z.enum(emergencyStateEnum.enumValues),
});

export type EmergencyUpdate = z.infer<typeof emergencyUpdateSchema>;

export const emergencyBulkUpdateSchema = z.object({
  ...deviceBulkSchema.shape,
  ...tagBulkSchema.shape,
  ...emergencyUpdateSchema.shape,
});

export type EmergencyBulkUpdate = z.infer<typeof emergencyBulkUpdateSchema>;

export const emergencyCountResponseSchema = z.object({
  lockdownCount: z.number(),
  evacuationCount: z.number(),
});

export type EmergencyCountResponse = z.infer<
  typeof emergencyCountResponseSchema
>;
