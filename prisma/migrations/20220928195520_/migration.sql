/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `Card` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scryfallId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("deckId", "scryfallId") SELECT "deckId", "scryfallId" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
