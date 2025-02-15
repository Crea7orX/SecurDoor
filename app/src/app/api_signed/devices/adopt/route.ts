import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { apiSignedResponseSchema } from "@/lib/validations/api-signed";
import { deviceAdopt } from "@/server/db/devices-states/queries";
import { type NextRequest, NextResponse } from "next/server";

// adopt device
export async function POST(request: NextRequest) {
  try {
    const { deviceId, ownerId } = await authenticateSigned(request);

    await deviceAdopt({
      deviceId,
      ownerId,
    });

    return NextResponse.json({
      status: "ok",
      ...apiSignedResponseSchema.parse({}),
    });
  } catch (error) {
    return handleError(error);
  }
}
