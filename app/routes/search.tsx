import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Search Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function SearchRoute() {
  return <h1>Search Route</h1>;
}
