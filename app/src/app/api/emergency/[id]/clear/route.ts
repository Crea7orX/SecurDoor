import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { emergencyResponseSchema } from "@/lib/validations/emergency";
import { emergencyStateSetDevice } from "@/server/db/emergency/queries";
import { type NextRequest, NextResponse } from "next/server";

interface EmergencyByIdClearProps {
  params: Promise<{ id: string }>;
}

// clear device emergency state
export async function POST(
  request: NextRequest,
  props: EmergencyByIdClearProps,
) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = authenticate(request);

    const device = await emergencyStateSetDevice(
      id,
      null, // clear emergency state
      userId,
      ownerId,
    );
    if (!device) throw new NotFoundError();

    return NextResponse.json(
      emergencyResponseSchema.parse({
        ...device,
        state: device.emergencyState,
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
