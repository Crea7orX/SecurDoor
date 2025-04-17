import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { logActorResponseSchema } from "@/lib/validations/log";
import { logsActorsGetAll } from "@/server/db/logs/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const actors = await logsActorsGetAll(ownerId);

    return NextResponse.json(logActorResponseSchema.array().parse(actors));
  } catch (error) {
    return handleError(error);
  }
}
