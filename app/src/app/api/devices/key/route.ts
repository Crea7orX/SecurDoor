import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { BadRequestError, NotFoundError } from "@/lib/exceptions";
import { deviceKeyResponseSchema } from "@/lib/validations/device";
import { deviceGetById } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = authenticate(req);

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) throw new BadRequestError();

    const device = await deviceGetById(id, userId);

    if (!device.length) throw new NotFoundError();

    return NextResponse.json(deviceKeyResponseSchema.parse(device[0]));
  } catch (error) {
    return handleError(error);
  }
}