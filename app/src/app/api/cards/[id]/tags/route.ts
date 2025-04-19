import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  cardTagsResponseSchema,
  type CardTagsUpdate,
  cardTagsUpdateResponseSchema,
  cardTagsUpdateSchema,
} from "@/lib/validations/card";
import {
  cardTagsGetAll,
  cardTagsUpdate,
} from "@/server/db/cards-to-tags/queries";
import { type NextRequest, NextResponse } from "next/server";

interface CardByIdProps {
  params: Promise<{ id: string }>;
}

// get card all tags by id
export async function GET(request: NextRequest, props: CardByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const tags = await cardTagsGetAll({ id, ownerId });

    return NextResponse.json(
      cardTagsResponseSchema.parse({
        tags: tags.map((tag) => ({
          ...tag,
        })),
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}

// update card tags
export async function POST(request: NextRequest, props: CardByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as CardTagsUpdate;
    const update = cardTagsUpdateSchema.parse(json);

    const [addedTags, removedTags] = await cardTagsUpdate({
      id,
      tagIds: update.tags,
      userId,
      ownerId,
    });

    return NextResponse.json(
      cardTagsUpdateResponseSchema.parse({
        addedTags: addedTags ?? [],
        removedTags: removedTags ?? [],
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
