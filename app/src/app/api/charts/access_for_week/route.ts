import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { chartAccessForWeekResponseSchema } from "@/lib/validations/chart";
import { chartGetAccessForWeek } from "@/server/db/charts/queries";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { ownerId } = authenticate(request);

    const url = new URL(request.url);
    const userTimezone = url.searchParams.get("userTimezone") ?? undefined;
    const isDashboard = url.searchParams.get("dashboard") === "true";

    const chartData = await chartGetAccessForWeek({
      ownerId,
      userTimezone,
      isDashboard,
    });

    return NextResponse.json(
      chartAccessForWeekResponseSchema.array().parse(chartData),
    );
  } catch (error) {
    return handleError(error);
  }
}
