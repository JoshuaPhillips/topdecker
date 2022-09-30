import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader = ({ request, params }: LoaderArgs) => {
  const { username } = params;
  if (!username) return redirect("/");
  return redirect(`/users/${username}`);
};
