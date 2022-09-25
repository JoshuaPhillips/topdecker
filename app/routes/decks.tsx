import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Deck Layout Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({});
};

export default function DeckLayoutRoute() {
  return (
    <>
      <h1>Deck Layout Route</h1>
      <Outlet />
    </>
  );
}
