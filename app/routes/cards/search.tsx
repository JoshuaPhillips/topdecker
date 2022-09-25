import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Card Search Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function CardSearchRoute() {
  return <h1>Card Search Route</h1>;
}
