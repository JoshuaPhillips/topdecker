// Use this to delete a user by their username
// Simply call this with:
// npx ts-node --require tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/services/db.server";

installGlobals();

const deleteUser = async (username: string) => {
  if (!username) {
    throw new Error("username required for login");
  }

  try {
    await prisma.user.delete({ where: { username } });
  } catch (error) {
    const isUserNotFoundError =
      error instanceof PrismaClientKnownRequestError && error.code === "P2025";

    if (isUserNotFoundError) {
      console.log("User not found, so no need to delete");
      return;
    }

    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

deleteUser(process.argv[2]);
