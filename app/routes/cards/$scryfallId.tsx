import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Card ID Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function CardIdRoute() {
  return (
    <>
      <h1>Card ID Layout Route</h1>
      <Outlet />
    </>
  );
}
