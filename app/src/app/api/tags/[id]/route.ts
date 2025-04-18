import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  tagResponseSchema,
  type TagUpdate,
  tagUpdateSchema,
} from "@/lib/validations/tag";
import { tagDelete, tagUpdate } from "@/server/db/tags/queries";
import { type NextRequest, NextResponse } from "next/server";

interface TagByIdProps {
  params: Promise<{ id: string }>;
}

// update tag
export async function PUT(request: NextRequest, props: TagByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as TagUpdate;
    const update = tagUpdateSchema.parse(json);

    const tag = await tagUpdate({ id, update, userId, ownerId });
    if (!tag) throw new NotFoundError();

    return NextResponse.json(tagResponseSchema.parse(tag));
  } catch (error) {
    return handleError(error);
  }
}

// delete tag
export async function DELETE(request: NextRequest, props: TagByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const tag = await tagDelete({ id, userId, ownerId });
    if (!tag) throw new NotFoundError();

    return NextResponse.json(tagResponseSchema.parse(tag));
  } catch (error) {
    return handleError(error);
  }
}
