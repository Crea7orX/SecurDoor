import { z } from "zod";

export const apiKeyCreateSchema = z.object({
  name: z.string().min(2).max(256),
});

export type ApiKeyCreate = z.infer<typeof apiKeyCreateSchema>;

export const apiKeyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  key: z.string(),
  ownerId: z.string(),
  createdAt: z.number(),
  lastUsedAt: z.number().nullable(),
});

export type ApiKeyResponse = z.infer<typeof apiKeyResponseSchema>;
