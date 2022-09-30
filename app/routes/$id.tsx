import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { prisma } from "~/services/db.server";
import { getUserById } from "~/services/user.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Missing ID in URL params");

  const deck = await prisma.deck.findFirst({
    where: { id: params.id },
    include: { User: { select: { username: true } } },
  });

  if (deck) return redirect(`/users/${deck.User.username}/decks/${deck.name}`);

  const user = await getUserById(params.id);
  if (user) return redirect(`/users/${user.username}`);

  return redirect(`/`);
};
