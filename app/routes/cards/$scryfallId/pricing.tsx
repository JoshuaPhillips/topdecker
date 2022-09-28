import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Card ID Route" });

export const loader = async ({ request, params }: LoaderArgs) => {
  return json({ params, pricing: Math.random() * 10 });
};

export default function CardIdRoute() {
  const { params, pricing } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Card ID Pricing Route</h1>
      <h2>{pricing.toFixed(4)}</h2>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </>
  );
}
