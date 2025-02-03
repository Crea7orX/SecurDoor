import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  emergencyResponseSchema,
  type EmergencyUpdate,
  emergencyUpdateSchema,
} from "@/lib/validations/emergency";
import {
  emergencyStateGetById,
  emergencyStateSetDevice,
} from "@/server/db/emergency/queries";
import { type NextRequest, NextResponse } from "next/server";

interface EmergencyByIdProps {
  params: Promise<{ id: string }>;
}

// get device emergency state by id
export async function GET(request: NextRequest, props: EmergencyByIdProps) {
  try {
    const { id } = await props.params;
    const { userId } = authenticate(request);

    const device = await emergencyStateGetById(id, userId);
    if (!device) throw new NotFoundError();

    return NextResponse.json(
      emergencyResponseSchema.parse({
        ...device,
        state: device.emergencyState,
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}

// update device emergency state
export async function POST(request: NextRequest, props: EmergencyByIdProps) {
  try {
    const { id } = await props.params;
    const { userId } = authenticate(request);

    const json = (await request.json()) as EmergencyUpdate;
    const update = emergencyUpdateSchema.parse(json);

    const device = await emergencyStateSetDevice(id, update.state, userId);
    if (!device) throw new NotFoundError();

    return NextResponse.json(
      emergencyResponseSchema.parse({
        ...device,
        state: device.emergencyState,
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
