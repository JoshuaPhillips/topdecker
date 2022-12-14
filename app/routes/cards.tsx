import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Card Layout Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function CardLayoutRoute() {
  return (
    <>
      <h1>Card Layout Route</h1>
      <Outlet />
    </>
  );
}
