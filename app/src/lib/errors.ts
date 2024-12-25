import "server-only";
import {
  BadRequestError,
  DeviceWithSameSerialIdError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/exceptions";
import { NextResponse } from "next/server";
import { z } from "zod";

export function handleError(error: unknown) {
  if (error instanceof BadRequestError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // todo: catching zod errors from return schema conversion
  if (error instanceof z.ZodError) {
    return NextResponse.json(error.issues, { status: 422 });
  }

  if (error instanceof DeviceWithSameSerialIdError) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }

  console.error(error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
