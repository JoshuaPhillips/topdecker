import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const meta: MetaFunction = () => ({ title: "New Deck Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function NewDeckRoute() {
  return <h1>New Deck Route</h1>;
}
