import { z } from "zod";

export const logResponseSchema = z.object({
  id: z.string(),
  action: z.string(),
  actor: z.string(),
  objectId: z.string().optional().nullable(),
  reference: z.string().array().optional().nullable(),
  ownerId: z.string(),
  createdAt: z.number(),
});

export type LogResponse = z.infer<typeof logResponseSchema>;
