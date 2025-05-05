import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { apiSignedResponseSchema } from "@/lib/validations/api-signed";
import {
  type BiometricCreate,
  biometricCreateSchema,
  biometricResponseSchema,
} from "@/lib/validations/biometric";
import { biometricInsert } from "@/server/db/biometrics/queries";
import { type NextRequest, NextResponse } from "next/server";

// create biometric
export async function POST(request: NextRequest) {
  try {
    const { deviceId, ownerId } = await authenticateSigned(request);

    const json = (await request.json()) as BiometricCreate;
    const create = biometricCreateSchema.parse(json);

    const biometric = await biometricInsert({
      create,
      userId: "system",
      ownerId,
      deviceId,
    });

    return NextResponse.json(
      {
        status: "ok",
        ...apiSignedResponseSchema.parse({}),
        data: biometricResponseSchema.parse(biometric),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return handleError(error);
  }
}
