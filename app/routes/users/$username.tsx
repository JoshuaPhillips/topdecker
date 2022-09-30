import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Username Layout Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return json({});
};

export default function UsernameLayoutRoute() {
  return (
    <>
      <h1>Username Layout Route</h1>
      <Outlet />
    </>
  );
}
