import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Card Layout Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json({});
};

export default function CardLayoutRoute() {
  return <h1>Card Index Route</h1>;
}
