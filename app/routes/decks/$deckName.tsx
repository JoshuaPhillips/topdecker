import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Deck Name Route" });

export const loader = ({ request, params }: LoaderArgs) => {
  return json({ deckName: params.deckName });
};

export default function DeckNameRoute() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Deck Name Route</h1>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </>
  );
}
