import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  DeviceCreate,
  deviceCreateSchema,
  deviceResponseSchema,
} from "@/lib/validations/device";
import { deviceInsert, devicesGetAll } from "@/server/db/devices/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = authenticate(request);

    const userDevices = await devicesGetAll(userId);

    return NextResponse.json(deviceResponseSchema.array().parse(userDevices));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = authenticate(request);

    const json = (await request.json()) as DeviceCreate;
    const deviceCreate = deviceCreateSchema.parse(json);

    const device = await deviceInsert(deviceCreate, userId);

    return NextResponse.json(deviceResponseSchema.parse(device[0]), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
