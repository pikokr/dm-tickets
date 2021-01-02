/*
  Warnings:

  - The migration will change the primary key for the `Ticket` table. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channel" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Ticket" ("channel", "user", "closed") SELECT "channel", "user", "closed" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
