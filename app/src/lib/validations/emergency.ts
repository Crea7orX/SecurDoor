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
