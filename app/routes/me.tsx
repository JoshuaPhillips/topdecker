import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/services/session.server";
import { getUserById } from "~/services/user.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (!user) return redirect("/login");

  throw redirect(`/users/${user.username}`);
};
