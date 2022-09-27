import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Username Layout Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json({ params });
};

export default function UsernameLayoutRoute() {
  const { params } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Username Layout Route</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </>
  );
}
