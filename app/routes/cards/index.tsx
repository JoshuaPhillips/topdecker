import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Card Layout Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return redirect("/cards/search");
};
