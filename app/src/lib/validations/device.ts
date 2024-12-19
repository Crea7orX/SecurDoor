import { z } from "zod";

export const deviceCreateSchema = z.object({
  name: z.string(),
  serialId: z.string().uuid(),
});

export type DeviceCreate = z.infer<typeof deviceCreateSchema>;

export const deviceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  serialId: z.string().uuid(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type DeviceResponse = z.infer<typeof deviceResponseSchema>;

export const deviceGetKeySchema = z.object({
  id: z.string(),
});

export type DeviceGetKey = z.infer<typeof deviceGetKeySchema>;

export const deviceKeyResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
});

export type DeviceKeyResponse = z.infer<typeof deviceKeyResponseSchema>;
