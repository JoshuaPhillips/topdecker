import type { LoaderArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader = ({ request }: LoaderArgs) => {
  return redirect("/cards/search");
};
