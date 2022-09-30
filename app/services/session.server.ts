import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/services/user.server";
import { getUserById } from "~/services/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

const SEVEN_DAYS_IN_HOURS = 60 * 60 * 24 * 7;

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const getSession = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

export const getUserId = async (
  request: Request
): Promise<User["id"] | undefined> => {
  const session = await getSession(request);
  return session.get("userId");
};

export const getUser = async (request: Request) => {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
};

export const requireUserId = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const userId = await getUserId(request);

  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`/login?${searchParams}`);
  }

  return userId;
};

export const requireUser = async (request: Request) => {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
};

export const createUserSession = async ({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) => {
  const session = await getSession(request);
  session.set("userId", userId);

  const maxAge = remember ? SEVEN_DAYS_IN_HOURS : undefined;

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, { maxAge }),
    },
  });
};

export const logout = async (request: Request) => {
  const session = await getSession(request);

  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};
