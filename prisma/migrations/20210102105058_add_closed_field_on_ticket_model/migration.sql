-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "channel" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "closed" BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY ("channel")
);
INSERT INTO "new_Ticket" ("channel", "user") SELECT "channel", "user" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
