-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProgramClub" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "members" INTEGER NOT NULL DEFAULT 0,
    "established" TEXT NOT NULL,
    "description" TEXT,
    "contact" TEXT,
    "logo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgramClub_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProgramClub" ("active", "contact", "createdAt", "description", "established", "id", "institution", "location", "logo", "members", "name", "programId", "updatedAt") SELECT "active", "contact", "createdAt", "description", "established", "id", "institution", "location", "logo", "members", "name", "programId", "updatedAt" FROM "ProgramClub";
DROP TABLE "ProgramClub";
ALTER TABLE "new_ProgramClub" RENAME TO "ProgramClub";
CREATE TABLE "new_ProgramStartup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT,
    "founded" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "teamSize" INTEGER NOT NULL DEFAULT 0,
    "fundingStage" TEXT,
    "fundingAmount" TEXT,
    "logo" TEXT,
    "websiteUrl" TEXT,
    "technologies" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProgramStartup_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProgramStartup" ("active", "category", "content", "createdAt", "description", "founded", "fundingAmount", "fundingStage", "id", "location", "logo", "name", "programId", "teamSize", "technologies", "updatedAt", "websiteUrl") SELECT "active", "category", "content", "createdAt", "description", "founded", "fundingAmount", "fundingStage", "id", "location", "logo", "name", "programId", "teamSize", "technologies", "updatedAt", "websiteUrl" FROM "ProgramStartup";
DROP TABLE "ProgramStartup";
ALTER TABLE "new_ProgramStartup" RENAME TO "ProgramStartup";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
