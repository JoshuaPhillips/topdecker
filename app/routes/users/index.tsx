import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Users Index Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function UsersIndexRoute() {
  return <h1>Users Index Route</h1>;
}
