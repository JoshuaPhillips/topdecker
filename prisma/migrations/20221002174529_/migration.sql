/*
  Warnings:

  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UserFollows";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_FollowersFollowing" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FollowersFollowing_A_fkey" FOREIGN KEY ("A") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FollowersFollowing_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FollowersFollowing_AB_unique" ON "_FollowersFollowing"("A", "B");

-- CreateIndex
CREATE INDEX "_FollowersFollowing_B_index" ON "_FollowersFollowing"("B");
