import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { logResponseSchema } from "@/lib/validations/log";
import { logsGetAll } from "@/server/db/logs/queries";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { userId } = authenticate(request);

    const logs = await logsGetAll(userId);

    return NextResponse.json(logResponseSchema.array().parse(logs));
  } catch (error) {
    return handleError(error);
  }
}
