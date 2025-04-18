import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { BadRequestError, NotFoundError } from "@/lib/exceptions";
import { deviceKeyResponseSchema } from "@/lib/validations/device";
import { deviceGetById } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) throw new BadRequestError();

    const device = await deviceGetById(id, ownerId);

    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceKeyResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
