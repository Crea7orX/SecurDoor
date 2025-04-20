import { authenticate } from "@/lib/auth";
import { handleError } from "@/lib/errors";
import {
  deviceTagsResponseSchema,
  type DeviceTagsUpdate,
  deviceTagsUpdateResponseSchema,
  deviceTagsUpdateSchema,
} from "@/lib/validations/device";
import {
  deviceTagsGetAll,
  deviceTagsUpdate,
} from "@/server/db/devices-to-tags/queries";
import { type NextRequest, NextResponse } from "next/server";

interface DeviceByIdProps {
  params: Promise<{ id: string }>;
}

// get device all tags by id
export async function GET(request: NextRequest, props: DeviceByIdProps) {
  try {
    const { id } = await props.params;
    const { ownerId } = await authenticate(request);

    const tags = await deviceTagsGetAll({ id, ownerId });

    return NextResponse.json(
      deviceTagsResponseSchema.parse({
        tags: tags.map((tag) => ({
          ...tag,
        })),
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}

// update device tags
export async function POST(request: NextRequest, props: DeviceByIdProps) {
  try {
    const { id } = await props.params;
    const { userId, ownerId } = await authenticate(request);

    const json = (await request.json()) as DeviceTagsUpdate;
    const update = deviceTagsUpdateSchema.parse(json);

    const [addedTags, removedTags] = await deviceTagsUpdate({
      id,
      tagIds: update.tags,
      userId,
      ownerId,
    });

    return NextResponse.json(
      deviceTagsUpdateResponseSchema.parse({
        addedTags: addedTags ?? [],
        removedTags: removedTags ?? [],
      }),
    );
  } catch (error) {
    return handleError(error);
  }
}
