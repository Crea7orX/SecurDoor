import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  cardResponseSchema,
  type CardUpdate,
  cardUpdateSchema,
} from "@/lib/validations/card";
import {
  cardDelete,
  cardGetByFingerprint,
  cardGetById,
  cardUpdate,
} from "@/server/db/cards/queries";
import { type NextRequest, NextResponse } from "next/server";

interface CardByIdProps {
  params: Promise<{ id: string }>;
}

// get card by id or fingerprint
export async function GET(request: NextRequest, props: CardByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const getFingerprint = url.searchParams.get("get_fingerprint");

    let card;
    if (getFingerprint !== "true") card = await cardGetById(id, ownerId);
    else card = await cardGetByFingerprint(id, ownerId);

    if (!card) throw new NotFoundError();

    return NextResponse.json(cardResponseSchema.parse(card));
  } catch (error) {
    return handleError(error);
  }
}

// update card
export async function PUT(request: NextRequest, props: CardByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as CardUpdate;
    const update = cardUpdateSchema.parse(json);

    const card = await cardUpdate(id, update, userId, ownerId);
    if (!card) throw new NotFoundError();

    return NextResponse.json(cardResponseSchema.parse(card));
  } catch (error) {
    return handleError(error);
  }
}

// delete card
export async function DELETE(request: NextRequest, props: CardByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const card = await cardDelete(id, userId, ownerId);
    if (!card) throw new NotFoundError();

    return NextResponse.json(cardResponseSchema.parse(card));
  } catch (error) {
    return handleError(error);
  }
}
