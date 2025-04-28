import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { webhookResponseSchema } from "@/lib/validations/webhook";
import { webhookDelete } from "@/server/db/webhooks/queries";
import { type NextRequest, NextResponse } from "next/server";

interface WebhookByIdProps {
  params: Promise<{ id: string }>;
}

// delete webhook
export async function DELETE(request: NextRequest, props: WebhookByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const webhook = await webhookDelete({ id, userId, ownerId });
    if (!webhook) throw new NotFoundError();

    return NextResponse.json(webhookResponseSchema.parse(webhook));
  } catch (error) {
    return handleError(error);
  }
}
