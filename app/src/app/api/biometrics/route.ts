import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  biometricsPaginatedResponseSchema,
  biometricsSearchParamsCache,
} from "@/lib/validations/biometric";
import { biometricsGetAll } from "@/server/db/biometrics/queries";
import { type NextRequest, NextResponse } from "next/server";

// get all biometrics
export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const searchParams = await biometricsSearchParamsCache.parse(
      Promise.resolve(url.searchParams),
    );

    const biometrics = await biometricsGetAll({ searchParams, ownerId });

    return NextResponse.json(
      biometricsPaginatedResponseSchema.parse(biometrics),
    );
  } catch (error) {
    return handleError(error);
  }
}
