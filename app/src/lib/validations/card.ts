import { z } from "zod";

export const cardCreateSchema = z.object({
  fingerprint: z.string().min(8).max(32),
  holder: z.string().min(2).max(256).optional().nullable(),
  active: z.boolean().optional().nullable(),
});

export type CardCreate = z.infer<typeof cardCreateSchema>;

export const cardResponseSchema = z.object({
  id: z.string(),
  fingerprint: z.string(),
  holder: z.string().optional().nullable(),
  active: z.boolean(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type CardResponse = z.infer<typeof cardResponseSchema>;
