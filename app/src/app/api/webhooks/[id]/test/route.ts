import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { webhookTest } from "@/server/db/webhooks/queries";
import { type NextRequest, NextResponse } from "next/server";

interface WebhookByIdProps {
  params: Promise<{ id: string }>;
}

// test webhook
export async function POST(request: NextRequest, props: WebhookByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    await webhookTest({ id, ownerId });

    return NextResponse.json({
      status: "ok",
    });
  } catch (error) {
    return handleError(error);
  }
}
