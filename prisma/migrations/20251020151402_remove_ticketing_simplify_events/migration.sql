/*
  Warnings:

  - You are about to drop the `EventFormField` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventFormSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventOrder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventPromoCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventRegistration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTicket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventTicketType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromoCodeTicket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `currency` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `customFields` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `enableTicketing` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `registrationLink` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EventFormSubmission_email_idx";

-- DropIndex
DROP INDEX "EventFormSubmission_eventId_idx";

-- DropIndex
DROP INDEX "EventOrder_orderNumber_key";

-- DropIndex
DROP INDEX "EventPromoCode_eventId_code_key";

-- DropIndex
DROP INDEX "EventTicket_qrCode_key";

-- DropIndex
DROP INDEX "PromoCodeTicket_promoCodeId_ticketTypeId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventFormField";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventFormSubmission";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventOrder";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventProduct";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventPromoCode";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventRegistration";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventTicket";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EventTicketType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PromoCodeTicket";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "endDate" DATETIME,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "maxAttendees" INTEGER,
    "currentAttendees" INTEGER NOT NULL DEFAULT 0,
    "program" TEXT,
    "imageUrl" TEXT,
    "gallery" TEXT,
    "externalTicketUrl" TEXT,
    "externalRegisterUrl" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("createdAt", "createdBy", "currentAttendees", "date", "description", "endDate", "id", "imageUrl", "location", "maxAttendees", "program", "status", "time", "title", "type", "updatedAt") SELECT "createdAt", "createdBy", "currentAttendees", "date", "description", "endDate", "id", "imageUrl", "location", "maxAttendees", "program", "status", "time", "title", "type", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
