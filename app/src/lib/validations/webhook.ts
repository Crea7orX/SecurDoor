import { webhookTypeEnum } from "@/server/db/webhooks/schema";
import { z } from "zod";

export const webhookCreateSchema = z.object({
  name: z.string().min(2).max(256),
  type: z.enum(webhookTypeEnum.enumValues),
  url: z.string().url().min(10).max(2048),
});

export type WebhookCreate = z.infer<typeof webhookCreateSchema>;

export const webhookResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(webhookTypeEnum.enumValues),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type WebhookResponse = z.infer<typeof webhookResponseSchema>;
