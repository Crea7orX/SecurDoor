import { cardResponseSchema } from "@/lib/validations/card";
import { deviceResponseSchema } from "@/lib/validations/device";
import { z } from "zod";

// DEVICE

export const accessDeviceResponseSchema = z.object({
  cards: z.array(
    cardResponseSchema.pick({
      id: true,
      fingerprint: true,
      holder: true,
    }),
  ),
});

export type AccessDeviceResponse = z.infer<typeof accessDeviceResponseSchema>;

export const accessDeviceUpdateSchema = z.object({
  cards: z.string().array(),
});

export type AccessDeviceUpdate = z.infer<typeof accessDeviceUpdateSchema>;

export const accessDeviceUpdateResponseSchema = z.object({
  addedCards: z.string().array(),
  removedCards: z.string().array(),
});

export type AccessDeviceUpdateResponse = z.infer<
  typeof accessDeviceUpdateResponseSchema
>;

// CARD

export const accessCardResponseSchema = z.object({
  devices: z.array(
    deviceResponseSchema.pick({
      id: true,
      name: true,
    }),
  ),
});

export type AccessCardResponse = z.infer<typeof accessCardResponseSchema>;

export const accessCardUpdateSchema = z.object({
  devices: z.string().array(),
});

export type AccessCardUpdate = z.infer<typeof accessCardUpdateSchema>;

export const accessCardUpdateResponseSchema = z.object({
  addedDevices: z.string().array(),
  removedDevices: z.string().array(),
});

export type AccessCardUpdateResponse = z.infer<
  typeof accessCardUpdateResponseSchema
>;

// CARD AUTHENTICATION

export const accessCardAuthenticationSchema = z.object({
  fingerprint: z.string(),
});

export type AccessCardAuthentication = z.infer<
  typeof accessCardAuthenticationSchema
>;

export const accessCardAuthenticationResponseSchema = z.object({
  isLocked: z.boolean(),
  reLockDelay: z.number(),
  holder: z.string().nullable(),
});

export type AccessCardAuthenticationResponse = z.infer<
  typeof accessCardAuthenticationResponseSchema
>;
