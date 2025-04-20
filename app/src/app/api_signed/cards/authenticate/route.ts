import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  type AccessCardAuthentication,
  accessCardAuthenticationResponseSchema,
  accessCardAuthenticationSchema,
} from "@/lib/validations/access";
import { accessCardTryAuthentication } from "@/server/db/access/queries";
import { type NextRequest, NextResponse } from "next/server";

// try card authentication
export async function POST(request: NextRequest) {
  try {
    const { device, deviceId, ownerId } = await authenticateSigned(request);

    const json = (await request.json()) as AccessCardAuthentication;
    const authentication = accessCardAuthenticationSchema.parse(json);

    const cardAuthentication = await accessCardTryAuthentication({
      ownerId,
      device,
      deviceId,
      fingerprint: authentication.fingerprint,
    });
    if (!cardAuthentication) throw new NotFoundError();

    return NextResponse.json(
      accessCardAuthenticationResponseSchema.parse(cardAuthentication),
    );
  } catch (error) {
    return handleError(error);
  }
}
