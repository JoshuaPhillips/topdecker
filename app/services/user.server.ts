import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/services/db.server";

export type { User } from "@prisma/client";

export const getUserById = async (id: User["id"]) => {
  return prisma.user.findUnique({ where: { id } });
};

export const getUserByUsername = async (username: User["username"]) => {
  return prisma.user.findUnique({ where: { username } });
};

export const createUser = async (
  username: User["username"],
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { username, password: { create: { hash: hashedPassword } } },
  });
};

export const deleteUserByUsername = async (username: User["username"]) => {
  return prisma.user.delete({ where: { username } });
};

export const verifyLogin = async (
  username: User["username"],
  password: Password["hash"]
) => {
  const userWithPassword = await prisma.user.findUnique({
    where: { username },
    include: { password: true },
  });

  if (!userWithPassword || !userWithPassword.password) return null;
  const { hash } = userWithPassword.password;

  const isValid = await bcrypt.compare(password, hash);
  if (!isValid) return null;

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
};
