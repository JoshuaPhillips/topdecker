import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "Deck ID Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function DeckIDRoute() {
  return <h1>Deck ID Route</h1>;
}
