import { LogDisplayInfos } from "@/config/logs";
import { webhookTypeEnum } from "@/server/db/webhooks/schema";
import { z } from "zod";

export const webhookCreateSchema = z.object({
  name: z.string().min(2).max(256),
  type: z.enum(webhookTypeEnum.enumValues),
  url: z.string().url().min(10).max(2048),
  scope: z
    .enum(Object.entries(LogDisplayInfos).map(([action]) => action) as [string])
    .array()
    .min(1),
});

export type WebhookCreate = z.infer<typeof webhookCreateSchema>;

export const webhookResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(webhookTypeEnum.enumValues),
  scope: z.string().array(),
  enabled: z.boolean(),
  ownerId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
});

export type WebhookResponse = z.infer<typeof webhookResponseSchema>;

export const webhookUpdateSchema = z.object({
  name: z.string().min(2).max(256).optional(),
  scope: z
    .enum(Object.entries(LogDisplayInfos).map(([action]) => action) as [string])
    .array()
    .min(1)
    .optional(),
  enabled: z.boolean().optional(),
});

export type WebhookUpdate = z.infer<typeof webhookUpdateSchema>;
