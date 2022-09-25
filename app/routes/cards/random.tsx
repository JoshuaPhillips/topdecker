import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => ({ title: "Random Card Route" });

export const loader = ({ request }: LoaderArgs) => {
  return json({ randomNumber: Math.random() });
};

export default function RandomCardRoute() {
  const { randomNumber } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>Random Card Route</h1>
      <pre>{JSON.stringify(randomNumber, null, 2)}</pre>
    </>
  );
}
