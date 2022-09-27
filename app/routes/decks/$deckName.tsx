import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Deck Name Route" });

export const loader = ({ request, params }: LoaderArgs) => {
  return json({ params });
};

export default function DeckNameRoute() {
  const { params } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Deck Name Route</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </>
  );
}
