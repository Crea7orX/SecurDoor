import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { deviceResponseSchema } from "@/lib/validations/device";
import { deviceGetById } from "@/server/db/devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface DevicesByIdProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: DevicesByIdProps) {
  try {
    const { id } = await props.params;
    const { userId } = authenticate(request);

    const device = await deviceGetById(id, userId);

    if (!device) throw new NotFoundError();

    return NextResponse.json(deviceResponseSchema.parse(device));
  } catch (error) {
    return handleError(error);
  }
}
