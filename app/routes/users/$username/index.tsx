import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Username Index Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json(params);
};

export default function UsernameIndexRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Username Index Route</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </>
  );
}
