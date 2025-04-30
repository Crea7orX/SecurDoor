import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  deviceResponseSchema,
  type DeviceSetPendingCommand,
  deviceSetPendingCommandSchema,
} from "@/lib/validations/device";
import { deviceSetPendingCommand } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface DevicesStateByIdProps {
  params: Promise<{ id: string }>;
}

// set device pending command by id
export async function POST(request: NextRequest, props: DevicesStateByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as DeviceSetPendingCommand;
    const set = deviceSetPendingCommandSchema.parse(json);

    const device = await deviceSetPendingCommand({
      id,
      set,
      userId,
      ownerId,
    });
    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
