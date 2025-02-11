import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { deviceResponseSchema } from "@/lib/validations/device";
import { deviceSetLocked } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface AccessByIdStateUnlockProps {
  params: Promise<{ id: string }>;
}

// unlock door
export async function POST(
  request: NextRequest,
  props: AccessByIdStateUnlockProps,
) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = authenticate(request);

    const device = await deviceSetLocked({
      id,
      userId,
      ownerId,
      isLocked: false,
    });
    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
