import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  type AccessBiometricAuthentication,
  accessBiometricAuthenticationResponseSchema,
  accessBiometricAuthenticationSchema,
} from "@/lib/validations/access";
import { accessBiometricTryAuthentication } from "@/server/db/access/queries";
import { type NextRequest, NextResponse } from "next/server";

// try biometric authentication
export async function POST(request: NextRequest) {
  try {
    const { device, deviceId, ownerId } = await authenticateSigned(request);

    const json = (await request.json()) as AccessBiometricAuthentication;
    const authentication = accessBiometricAuthenticationSchema.parse(json);

    const biometricAuthentication = await accessBiometricTryAuthentication({
      ownerId,
      device,
      deviceId,
      biometricId: authentication.biometricId,
    });
    if (!biometricAuthentication) throw new NotFoundError();

    return NextResponse.json(
      accessBiometricAuthenticationResponseSchema.parse(
        biometricAuthentication,
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
