import { z } from "zod";

export const deviceSignedIntroduceSchema = z.object({
  publicKey: z.string().min(1).max(2048),
});

export type DeviceIntroduce = z.infer<typeof deviceSignedIntroduceSchema>;
