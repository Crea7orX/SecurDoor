import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  accessCardResponseSchema,
  type AccessCardUpdate,
  accessCardUpdateResponseSchema,
  accessCardUpdateSchema,
} from "@/lib/validations/access";
import {
  accessCardGetAll,
  accessCardUpdate,
} from "@/server/db/cards-to-devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface AccessCardByIdProps {
  params: Promise<{ id: string }>;
}

// get access to card
export async function GET(request: NextRequest, props: AccessCardByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = authenticate(request);

    const devices = await accessCardGetAll(id, ownerId);

    return NextResponse.json(
      accessCardResponseSchema.parse({
        devices: devices.map((device) => ({
          id: device.id,
          name: device.name,
        })),
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}

// update access to card
export async function POST(request: Request, props: AccessCardByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = authenticate(request);

    const json = (await request.json()) as AccessCardUpdate;
    const update = accessCardUpdateSchema.parse(json);

    const [addedDevices, removedDevices] = await accessCardUpdate(
      id,
      update.devices,
      userId,
      ownerId,
    );

    return NextResponse.json(
      accessCardUpdateResponseSchema.parse({
        addedDevices: addedDevices ?? [],
        removedDevices: removedDevices ?? [],
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
