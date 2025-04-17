import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  logsSearchParamsCache,
  logsPaginatedResponseSchema,
} from "@/lib/validations/log";
import { logsGetAll } from "@/server/db/logs/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const searchParams = await logsSearchParamsCache.parse(
      Promise.resolve(url.searchParams),
    );

    const logs = await logsGetAll(searchParams, ownerId);

    return NextResponse.json(logsPaginatedResponseSchema.parse(logs));
  } catch (error) {
    return handleError(error);
  }
}
