import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  accessDeviceResponseSchema,
  type AccessDeviceUpdate,
  accessDeviceUpdateResponseSchema,
  accessDeviceUpdateSchema,
} from "@/lib/validations/access";
import {
  accessDeviceGetAll,
  accessDeviceUpdate,
} from "@/server/db/cards-to-devices/queries";
import { type NextRequest, NextResponse } from "next/server";

interface AccessDeviceByIdProps {
  params: Promise<{ id: string }>;
}

// get access to device
export async function GET(request: NextRequest, props: AccessDeviceByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const cards = await accessDeviceGetAll(id, ownerId);

    return NextResponse.json(
      accessDeviceResponseSchema.parse({
        cards: cards.map((card) => ({
          id: card.id,
          fingerprint: card.fingerprint,
          holder: card.holder,
        })),
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}

// update access to device
export async function POST(request: NextRequest, props: AccessDeviceByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as AccessDeviceUpdate;
    const update = accessDeviceUpdateSchema.parse(json);

    const [addedCards, removedCards] = await accessDeviceUpdate(
      id,
      update.cards,
      userId,
      ownerId,
    );

    return NextResponse.json(
      accessDeviceUpdateResponseSchema.parse({
        addedCards: addedCards ?? [],
        removedCards: removedCards ?? [],
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
