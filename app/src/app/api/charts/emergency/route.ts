import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { chartEmergencyForWeekResponseSchema } from "@/lib/validations/chart";
import { chartGetEmergencyForWeek } from "@/server/db/charts/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = authenticate(request);

    const url = new URL(request.url);
    const userTimezone = url.searchParams.get("userTimezone") ?? undefined;

    const chartData = await chartGetEmergencyForWeek({
      ownerId,
      userTimezone,
    });

    return NextResponse.json(
      chartEmergencyForWeekResponseSchema.array().parse(chartData),
    );
  } catch (error) {
    return handleError(error);
  }
}
