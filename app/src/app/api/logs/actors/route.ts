import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { logActorResponseSchema } from "@/lib/validations/log";
import { logsActorsGetAll } from "@/server/db/logs/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { ownerId } = authenticate(request);

    const actors = await logsActorsGetAll(ownerId);

    return NextResponse.json(logActorResponseSchema.array().parse(actors));
  } catch (error) {
    return handleError(error);
  }
}
