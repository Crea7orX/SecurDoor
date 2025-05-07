import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { biometricsGetKnownSchema } from "@/lib/validations/biometric";
import { biometricsGetKnown } from "@/server/db/biometrics/queries";
import { type NextRequest, NextResponse } from "next/server";

// get known biometric ids of device
export async function POST(request: NextRequest) {
  try {
    const { deviceId, ownerId } = await authenticateSigned(request);

    const knownBiometrics = await biometricsGetKnown({
      deviceId,
      ownerId,
    });
    if (!knownBiometrics) throw new NotFoundError();

    return NextResponse.json(
      biometricsGetKnownSchema.parse({ knownBiometricIds: knownBiometrics }),
    );
  } catch (error) {
    return handleError(error);
  }
}
