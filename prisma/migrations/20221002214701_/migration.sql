/*
  Warnings:

  - You are about to drop the column `scryfallId` on the `DeckCard` table. All the data in the column will be lost.
  - Added the required column `cardId` to the `DeckCard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Card" (
    "scryfallId" TEXT NOT NULL PRIMARY KEY
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeckCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "count" INTEGER NOT NULL,
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    CONSTRAINT "DeckCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DeckCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("scryfallId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_DeckCard" ("count", "deckId", "id") SELECT "count", "deckId", "id" FROM "DeckCard";
DROP TABLE "DeckCard";
ALTER TABLE "new_DeckCard" RENAME TO "DeckCard";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
