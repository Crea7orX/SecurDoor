import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { cardResponseSchema } from "@/lib/validations/card";
import { cardGetById, cardGetByFingerprint } from "@/server/db/cards/queries";
import { type NextRequest, NextResponse } from "next/server";

interface CardsByIdProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: CardsByIdProps) {
  try {
    const { id } = await props.params;
    const { userId } = authenticate(request);

    const url = new URL(request.url);
    const getFingerprint = url.searchParams.get("get_fingerprint");

    let card;
    if (getFingerprint !== "true") card = await cardGetById(id, userId);
    else card = await cardGetByFingerprint(id, userId);

    if (!card) throw new NotFoundError();

    return NextResponse.json(cardResponseSchema.parse(card));
  } catch (error) {
    return handleError(error);
  }
}
