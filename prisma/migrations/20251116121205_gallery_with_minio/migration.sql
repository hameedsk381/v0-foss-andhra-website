/*
  Warnings:

  - You are about to drop the column `registrationLink` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `EventRegistration` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."EventRegistration" DROP CONSTRAINT "EventRegistration_eventId_fkey";

-- AlterTable
ALTER TABLE "Analytics" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "focusKeyword" TEXT,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "twitterCard" TEXT,
ADD COLUMN     "twitterDescription" TEXT,
ADD COLUMN     "twitterImage" TEXT,
ADD COLUMN     "twitterTitle" TEXT;

-- AlterTable
ALTER TABLE "Donation" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "registrationLink";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."EventRegistration";

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tagline" TEXT,
    "mission" TEXT,
    "color" TEXT NOT NULL,
    "logo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramInitiative" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "icon" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramInitiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramTeamMember" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "email" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramCaseStudy" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "metrics" TEXT,
    "category" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramCaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramClub" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramProject" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "githubUrl" TEXT,
    "websiteUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "technologies" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "contributors" INTEGER NOT NULL DEFAULT 0,
    "logo" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramStartup" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramStartup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramRepository" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT,
    "category" TEXT,
    "type" TEXT,
    "url" TEXT,
    "features" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramRepository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- AddForeignKey
ALTER TABLE "ProgramInitiative" ADD CONSTRAINT "ProgramInitiative_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramTeamMember" ADD CONSTRAINT "ProgramTeamMember_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCaseStudy" ADD CONSTRAINT "ProgramCaseStudy_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramClub" ADD CONSTRAINT "ProgramClub_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramProject" ADD CONSTRAINT "ProgramProject_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramStartup" ADD CONSTRAINT "ProgramStartup_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramRepository" ADD CONSTRAINT "ProgramRepository_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
