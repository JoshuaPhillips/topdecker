import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Card ID Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json({ params });
};

export default function CardIdRoute() {
  const { params } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Card ID Route</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </>
  );
}
