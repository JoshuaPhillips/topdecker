import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getDeckById } from "~/services/deck.server";
import { getUserById } from "~/services/user.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.id, "Missing ID in URL params");

  const deck = await getDeckById(params.id);
  if (deck) return redirect(`/decks/${deck.name}`);

  const user = await getUserById(params.id);
  if (user) return redirect(`/users/${user.username}`);

  // check for a match in Card ID

  return redirect("/decks");
};
