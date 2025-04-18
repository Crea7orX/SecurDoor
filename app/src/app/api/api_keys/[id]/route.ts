import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { apiKeyResponseSchema } from "@/lib/validations/api-key";
import { apiKeyDelete } from "@/server/db/api-keys/queries";
import { type NextRequest, NextResponse } from "next/server";

interface ApiKeyByIdProps {
  params: Promise<{ id: string }>;
}

// delete api key
export async function DELETE(request: NextRequest, props: ApiKeyByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const apiKey = await apiKeyDelete({ id, userId, ownerId });
    if (!apiKey) throw new NotFoundError();

    return NextResponse.json(apiKeyResponseSchema.parse(apiKey));
  } catch (error) {
    return handleError(error);
  }
}
