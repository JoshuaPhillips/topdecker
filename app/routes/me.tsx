import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  throw redirect(`/users/${userId}`);
};
