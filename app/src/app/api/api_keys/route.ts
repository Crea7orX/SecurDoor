import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  type ApiKeyCreate,
  apiKeyCreateSchema,
  apiKeyResponseSchema,
} from "@/lib/validations/api-key";
import { apiKeysGetAll, apiKeyInsert } from "@/server/db/api-keys/queries";
import { type NextRequest, NextResponse } from "next/server";

// get api keys
export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const apiKeys = await apiKeysGetAll({ ownerId });

    return NextResponse.json(apiKeyResponseSchema.array().parse(apiKeys));
  } catch (error) {
    return handleError(error);
  }
}

// create api key
export async function POST(request: NextRequest) {
  try {
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as ApiKeyCreate;
    const create = apiKeyCreateSchema.parse(json);

    const apiKey = await apiKeyInsert({ create, userId, ownerId });

    return NextResponse.json(apiKeyResponseSchema.parse(apiKey), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
