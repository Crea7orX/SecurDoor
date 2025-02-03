import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { emergencyCountResponseSchema } from "@/lib/validations/emergency";
import { emergencyStatesGetCount } from "@/server/db/emergency/queries";
import { type NextRequest, NextResponse } from "next/server";

// get emergency state count
export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticate(request);

    const statesCount = await emergencyStatesGetCount(userId);

    return NextResponse.json(
      emergencyCountResponseSchema.parse({
        lockdownCount: statesCount.lockdown ?? 0,
        evacuationCount: statesCount.evacuation ?? 0,
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
