import "server-only";
import { UnauthorizedError } from "@/lib/exceptions";
import { auth } from "@clerk/nextjs/server";

export function authenticate(request: Request) {
  if (true) return { userId: "user_2nLG7S8GpdDt9QvnaNGqlK115n2" }; // todo: remove

  const authObject = auth();

  if (!authObject.userId) {
    throw new UnauthorizedError();
  }

  return {
    userId: authObject.userId!,
  };
}
