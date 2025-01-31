import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  type CardCreate,
  cardCreateSchema,
  cardResponseSchema,
  cardsSearchParamsCache,
  cardsPaginatedResponseSchema,
} from "@/lib/validations/card";
import { cardInsert, cardsGetAll } from "@/server/db/cards/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = authenticate(request);

    const url = new URL(request.url);
    const searchParams = await cardsSearchParamsCache.parse(
      Promise.resolve(url.searchParams),
    );

    const cards = await cardsGetAll(searchParams, userId);

    return NextResponse.json(cardsPaginatedResponseSchema.parse(cards));
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = authenticate(request);

    const json = (await request.json()) as CardCreate;
    const create = cardCreateSchema.parse(json);

    const card = await cardInsert(create, userId);

    return NextResponse.json(cardResponseSchema.parse(card), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
