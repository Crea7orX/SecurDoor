import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  emergencyResponseSchema,
  type EmergencyBulkUpdate,
  emergencyBulkUpdateSchema,
} from "@/lib/validations/emergency";
import { emergencyStateSetDevices } from "@/server/db/emergency/queries";
import { type NextRequest, NextResponse } from "next/server";

// update devices emergency states
export async function POST(request: NextRequest) {
  try {
    const { userId, ownerId } = authenticate(request);

    const json = (await request.json()) as EmergencyBulkUpdate;
    const update = emergencyBulkUpdateSchema.parse(json);

    const devices = await emergencyStateSetDevices({
      deviceIds: update.deviceIds,
      state: update.state,
      userId,
      ownerId,
    });
    if (!devices) throw new NotFoundError();

    return NextResponse.json(
      emergencyResponseSchema.array().parse(
        devices.map((device) => ({
          ...device,
          state: device.emergencyState,
        })),
      ),
    );
  } catch (error) {
    return handleError(error);
  }
}
