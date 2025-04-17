import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { chartActiveUsersForWeekResponseSchema } from "@/lib/validations/chart";
import { chartGetActiveUsersForWeek } from "@/server/db/charts/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const url = new URL(request.url);
    const userTimezone = url.searchParams.get("userTimezone") ?? undefined;
    const isDashboard = url.searchParams.get("dashboard") === "true";

    const chartData = await chartGetActiveUsersForWeek({
      ownerId,
      userTimezone,
      isDashboard,
    });

    return NextResponse.json(
      chartActiveUsersForWeekResponseSchema.array().parse(chartData),
    );
  } catch (error) {
    return handleError(error);
  }
}
