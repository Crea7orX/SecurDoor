import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  type TagCreate,
  tagCreateSchema,
  tagResponseSchema,
  tagsPaginatedResponseSchema,
  tagsSearchParamsCache,
} from "@/lib/validations/tag";
import { tagInsert, tagsGetAll } from "@/server/db/tags/queries";
import { type NextRequest, NextResponse } from "next/server";

// get all tags
export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const searchParams = await tagsSearchParamsCache.parse(
      Promise.resolve(url.searchParams),
    );

    const tags = await tagsGetAll({ searchParams, ownerId });

    return NextResponse.json(tagsPaginatedResponseSchema.parse(tags));
  } catch (error) {
    return handleError(error);
  }
}

// create tag
export async function POST(request: NextRequest) {
  try {
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as TagCreate;
    const create = tagCreateSchema.parse(json);

    const tag = await tagInsert({ create, userId, ownerId });

    return NextResponse.json(tagResponseSchema.parse(tag), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
