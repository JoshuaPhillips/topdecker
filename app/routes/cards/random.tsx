import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRandomCard } from "~/services/scryfall.server";

export const meta: MetaFunction = () => ({ title: "Random Card Route" });

export const loader = async ({ request }: LoaderArgs) => {
  return json({ cardDetails: await getRandomCard() });
};

export default function RandomCardRoute() {
  const { cardDetails } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Random Card Route</h1>
      <pre>{JSON.stringify(cardDetails, null, 2)}</pre>
    </>
  );
}
