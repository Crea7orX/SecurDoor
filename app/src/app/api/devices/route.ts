import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  type DeviceCreate,
  deviceCreateSchema,
  deviceResponseSchema,
  devicesPaginatedResponseSchema,
  devicesSearchParamsCache,
} from "@/lib/validations/device";
import { deviceInsert, devicesGetAll } from "@/server/db/devices/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { ownerId } = authenticate(request);

    const url = new URL(request.url);
    const searchParams = await devicesSearchParamsCache.parse(
      Promise.resolve(url.searchParams),
    );

    const devices = await devicesGetAll(searchParams, ownerId);

    return NextResponse.json(devicesPaginatedResponseSchema.parse(devices));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId, ownerId } = authenticate(request);

    const json = (await request.json()) as DeviceCreate;
    const deviceCreate = deviceCreateSchema.parse(json);

    const device = await deviceInsert(deviceCreate, userId, ownerId);

    return NextResponse.json(deviceResponseSchema.parse(device), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
