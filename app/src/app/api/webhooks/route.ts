import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  type WebhookCreate,
  webhookCreateSchema,
  webhookResponseSchema,
} from "@/lib/validations/webhook";
import { webhookInsert, webhooksGetAll } from "@/server/db/webhooks/queries";
import { type NextRequest, NextResponse } from "next/server";

// get webhooks
export async function GET(request: NextRequest) {
  try {
    const { ownerId } = await authenticate(request);

    const webhooks = await webhooksGetAll({ ownerId });

    return NextResponse.json(webhookResponseSchema.array().parse(webhooks));
  } catch (error) {
    return handleError(error);
  }
}

// create webhook
export async function POST(request: NextRequest) {
  try {
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as WebhookCreate;
    const create = webhookCreateSchema.parse(json);

    const webhook = await webhookInsert({ create, userId, ownerId });

    return NextResponse.json(webhookResponseSchema.parse(webhook), {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
