import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Deck Index Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function DeckIndexRoute() {
  return <h1>Deck Index Route</h1>;
}
