import "server-only";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/exceptions";
import { verifySignature } from "@/lib/signatures";
import { apiSignedSchema } from "@/lib/validations/api-signed";
import { deviceGetBySerialIdUnprotected } from "@/server/db/devices/queries";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";
import { z } from "zod";

export function authenticate(request: Request) {
  const authObject = auth();

  if (!authObject.userId) {
    throw new UnauthorizedError();
  }

  return {
    userId: authObject.userId,
    ownerId: authObject.orgId ?? authObject.userId,
  };
}

export async function authenticateSigned(request: NextRequest) {
  // make a copy so we can read the body without interfering request handlers
  const requestClone = request.clone();

  const serialId = validateSignedSerialId(requestClone);
  const signature = validateSignedSignature(requestClone);

  const body = (await requestClone.json()) as unknown;
  const timestamp = await validateSignedTimestamp(body);

  // check if device exists
  const device = await deviceGetBySerialIdUnprotected(serialId);
  if (!device) {
    throw new NotFoundError();
  }

  // check if device public key is set
  if (!device.publicKey) {
    throw new UnauthorizedError();
  }

  // verify signature
  if (
    !verifySignature({
      data: JSON.stringify(body),
      signature,
      publicKeyWithoutHeaders: device.publicKey,
    })
  ) {
    throw new UnauthorizedError();
  }

  return {
    deviceId: device.id,
    ownerId: device.ownerId,
    timestamp,
  };
}

export function validateSignedSerialId(request: Request) {
  const serialId = request.headers.get("X-Serial-ID");
  if (!serialId || !z.string().uuid().safeParse(serialId).success) {
    throw new BadRequestError();
  }

  return serialId;
}

export function validateSignedSignature(request: Request) {
  const signature = request.headers.get("X-Signature");
  if (!signature) {
    throw new BadRequestError();
  }

  return signature;
}

export async function validateSignedTimestamp(body: unknown) {
  const timestamp = apiSignedSchema.safeParse(body).data?.timestamp;
  if (!timestamp) {
    throw new BadRequestError();
  }

  // 60 seconds range - 30 before now and 30 after
  if (
    timestamp < Date.now() / 1000 - 30 ||
    timestamp > Date.now() / 1000 + 30
  ) {
    throw new UnauthorizedError();
  }

  return timestamp;
}
