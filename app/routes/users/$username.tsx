import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "User ID Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json({ username: params.username });
};

export default function UsernameRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Username Route</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </>
  );
}
