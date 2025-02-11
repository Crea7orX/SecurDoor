import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { deviceStateResponseSchema } from "@/lib/validations/device-state";
import { deviceStateGetByDeviceId } from "@/server/db/devices-states/queries";
import { type NextRequest, NextResponse } from "next/server";

interface DevicesStateByIdProps {
  params: Promise<{ id: string }>;
}

// get device state by id
export async function GET(request: NextRequest, props: DevicesStateByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = authenticate(request);

    const deviceState = await deviceStateGetByDeviceId({
      deviceId: id,
      ownerId,
    });
    if (!deviceState) throw new NotFoundError();

    return NextResponse.json(deviceStateResponseSchema.parse(deviceState));
  } catch (error) {
    return handleError(error);
  }
}
