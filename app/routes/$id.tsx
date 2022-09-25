import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = async ({ request, params }: LoaderArgs) => {
  console.log({ params });

  // check for a match in Deck ID
  // check for a match in Card ID
  // check for a match in User ID

  return redirect("/decks");
};
