import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    timestamp: Math.floor(Date.now() / 1000),
  });
}
