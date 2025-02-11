import { authenticateSigned } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  type DeviceHeartbeat,
  deviceHeartbeatResponseSchema,
  deviceHeartbeatSchema,
} from "@/lib/validations/device-heartbeat";
import { deviceStateHeartbeat } from "@/server/db/devices-states/queries";
import { type NextRequest, NextResponse } from "next/server";

// heartbeat of device
export async function PATCH(request: NextRequest) {
  try {
    const { deviceId, ownerId } = await authenticateSigned(request);

    const json = (await request.json()) as DeviceHeartbeat;
    const heartbeat = deviceHeartbeatSchema.parse(json);

    const deviceHeartbeat = await deviceStateHeartbeat({
      deviceId,
      ownerId,
      heartbeat,
    });
    if (!deviceHeartbeat) throw new NotFoundError();

    return NextResponse.json(
      deviceHeartbeatResponseSchema.parse(deviceHeartbeat),
    );
  } catch (error) {
    return handleError(error);
  }
}
