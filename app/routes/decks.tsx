import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Deck Layout Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function DeckLayoutRoute() {
  return <h1>Deck Layout Route</h1>;
}
