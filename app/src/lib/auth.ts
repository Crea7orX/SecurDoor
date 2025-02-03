import "server-only";
import { UnauthorizedError } from "@/lib/exceptions";
import { auth } from "@clerk/nextjs/server";

export function authenticate(request: Request) {
  const authObject = auth();

  if (!authObject.userId) {
    throw new UnauthorizedError();
  }

  return {
    userId: authObject.userId,
    ownerId: authObject.orgId ?? authObject.userId,
  };
}
