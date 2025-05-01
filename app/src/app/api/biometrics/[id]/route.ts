import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import { NotFoundError } from "@/lib/exceptions";
import {
  biometricResponseSchema,
  type BiometricUpdate,
  biometricUpdateSchema,
} from "@/lib/validations/biometric";
import {
  biometricDelete,
  biometricGetById,
  biometricUpdate,
} from "@/server/db/biometrics/queries";
import { type NextRequest, NextResponse } from "next/server";

interface BiometricByIdProps {
  params: Promise<{ id: string }>;
}

// get biometric by id
export async function GET(request: NextRequest, props: BiometricByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const biometric = await biometricGetById({ id, ownerId });
    if (!biometric) throw new NotFoundError();

    return NextResponse.json(biometricResponseSchema.parse(biometric));
  } catch (error) {
    return handleError(error);
  }
}

// update biometric
export async function PUT(request: NextRequest, props: BiometricByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as BiometricUpdate;
    const update = biometricUpdateSchema.parse(json);

    const biometric = await biometricUpdate({
      id,
      update,
      userId,
      ownerId,
    });
    if (!biometric) throw new NotFoundError();

    return NextResponse.json(biometricResponseSchema.parse(biometric));
  } catch (error) {
    return handleError(error);
  }
}

// delete biometric
export async function DELETE(request: NextRequest, props: BiometricByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const biometric = await biometricDelete({
      id,
      userId,
      ownerId,
    });
    if (!biometric) throw new NotFoundError();

    return NextResponse.json(biometricResponseSchema.parse(biometric));
  } catch (error) {
    return handleError(error);
  }
}
