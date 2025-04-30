import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import { webhookResponseSchema, type WebhookUpdate, webhookUpdateSchema } from "@/lib/validations/webhook";
import { webhookDelete, webhookUpdate } from "@/server/db/webhooks/queries";
import { type NextRequest, NextResponse } from "next/server";

interface WebhookByIdProps {
  params: Promise<{ id: string }>;
}

// update webhook
export async function PUT(request: NextRequest, props: WebhookByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as WebhookUpdate;
    const update = webhookUpdateSchema.parse(json);

    const webhook = await webhookUpdate({ id, update, userId, ownerId });
    if (!webhook) throw new NotFoundError();

    return NextResponse.json(webhookResponseSchema.parse(webhook));
  } catch (error) {
    return handleError(error);
  }
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
