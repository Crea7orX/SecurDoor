import { z } from "zod";

export const apiSignedSchema = z.object({
  timestamp: z.number().min(0),
});

export type ApiSigned = z.infer<typeof apiSignedSchema>;

export const apiSignedResponseSchema = z.object({
  timestamp: z.number().default(() => Math.floor(Date.now() / 1000)), // Current timestamp
});

export type ApiSignedResponse = z.infer<typeof apiSignedResponseSchema>;
