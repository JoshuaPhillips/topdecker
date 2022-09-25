/*
  Warnings:

  - Added the required column `owner` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Card" (
    "scryfallId" TEXT NOT NULL PRIMARY KEY,
    "deckId" TEXT NOT NULL,
    CONSTRAINT "Card_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Deck" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "owner" TEXT NOT NULL,
    CONSTRAINT "Deck_owner_fkey" FOREIGN KEY ("owner") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Deck" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "Deck";
DROP TABLE "Deck";
ALTER TABLE "new_Deck" RENAME TO "Deck";
CREATE UNIQUE INDEX "Deck_name_key" ON "Deck"("name");
CREATE UNIQUE INDEX "Deck_owner_key" ON "Deck"("owner");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
