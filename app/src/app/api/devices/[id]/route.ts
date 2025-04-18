import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  deviceResponseSchema,
  type DeviceUpdate,
  deviceUpdateSchema,
} from "@/lib/validations/device";
import {
  deviceDelete,
  deviceGetById,
  deviceUpdate,
} from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface DevicesByIdProps {
  params: Promise<{ id: string }>;
}

// get device by id
export async function GET(request: NextRequest, props: DevicesByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const device = await deviceGetById(id, ownerId);

    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}

// update device
export async function PUT(request: NextRequest, props: DevicesByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as DeviceUpdate;
    const update = deviceUpdateSchema.parse(json);

    const device = await deviceUpdate(id, update, userId, ownerId);
    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}

// delete device
export async function DELETE(request: NextRequest, props: DevicesByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const device = await deviceDelete(id, userId, ownerId);
    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
