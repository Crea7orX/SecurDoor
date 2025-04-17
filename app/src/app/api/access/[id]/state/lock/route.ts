import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { deviceResponseSchema } from "@/lib/validations/device";
import { deviceSetLocked } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface AccessByIdStateLockProps {
  params: Promise<{ id: string }>;
}

// lock door
export async function POST(
  request: NextRequest,
  props: AccessByIdStateLockProps,
) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const device = await deviceSetLocked({
      id,
      userId,
      ownerId,
      isLocked: true,
    });
    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
