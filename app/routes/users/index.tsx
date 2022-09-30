import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Users Layout Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function UsersLayoutRoute() {
  return <h1>Users Index Route</h1>;
}
