import { z } from "zod";

export const apiSignedSchema = z.object({
  timestamp: z.number().min(0),
});

export type ApiSigned = z.infer<typeof apiSignedSchema>;
