import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { type DeviceBulk, deviceBulkSchema } from "@/lib/validations/device";
import { emergencyResponseSchema } from "@/lib/validations/emergency";
import { type TagBulk, tagBulkSchema } from "@/lib/validations/tag";
import { emergencyStateSetDevices } from "@/server/db/emergency/queries";
import { type NextRequest, NextResponse } from "next/server";

// clear devices emergency states
export async function POST(request: NextRequest) {
  try {
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as DeviceBulk & TagBulk;
    const update = deviceBulkSchema.extend(tagBulkSchema.shape).parse(json);

    const devices = await emergencyStateSetDevices({
      deviceIds: update.deviceIds,
      tagIds: update.tagIds,
      state: null,
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
