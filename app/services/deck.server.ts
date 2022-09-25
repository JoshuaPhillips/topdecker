import type { Deck } from "@prisma/client";
import { prisma } from "~/services/db.server";

export type { Deck } from "@prisma/client";

export const getDeckById = async (id: Deck["id"]) => {
  return prisma.deck.findUnique({ where: { id } });
};

export const createDeck = async (name: Deck["name"]) => {
  return prisma.deck.findUnique({
    where: { name },
    include: { cards: { select: { scryfallId: true } } },
  });
};

export const updateDeckById = async (
  id: Deck["id"],
  data: Omit<Deck, "id" | "createdAt" | "updatedAt">
) => {
  return prisma.deck.update({ where: { id }, data });
};

export const deleteDeckById = async (id: Deck["id"]) => {
  return prisma.deck.delete({ where: { id } });
};
