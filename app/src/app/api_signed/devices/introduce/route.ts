import { validateSignedSerialId } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError, PublicKeyAlreadySetError } from "@/lib/exceptions";
import { apiSignedResponseSchema } from "@/lib/validations/api-signed";
import {
  type DeviceIntroduce,
  deviceSignedIntroduceSchema,
} from "@/lib/validations/device-signed";
import {
  deviceGetBySerialIdUnprotected,
  deviceSetPublicKeyBySerialId,
} from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

// introduce device and set public key
export async function POST(request: NextRequest) {
  try {
    const serialId = validateSignedSerialId(request);

    // check if device exists
    const device = await deviceGetBySerialIdUnprotected(serialId);
    if (!device) {
      throw new NotFoundError();
    }

    // check if device public key is set
    if (device.publicKey) {
      throw new PublicKeyAlreadySetError();
    }

    const json = (await request.json()) as DeviceIntroduce;
    const introduce = deviceSignedIntroduceSchema.parse(json);

    // set public key
    await deviceSetPublicKeyBySerialId(serialId, introduce.publicKey);

    return NextResponse.json({
      status: "ok",
      ...apiSignedResponseSchema.parse({}),
    });
  } catch (error) {
    return handleError(error);
  }
}
