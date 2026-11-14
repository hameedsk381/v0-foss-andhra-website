-- Clubs portal: club registrations + public club pages + leaderboard
ALTER TABLE "ProgramClub"
  ALTER COLUMN "programId" DROP NOT NULL,
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'approved',
  ADD COLUMN "email" TEXT,
  ADD COLUMN "coordinatorName" TEXT,
  ADD COLUMN "coordinatorPhone" TEXT,
  ADD COLUMN "githubUrl" TEXT,
  ADD COLUMN "websiteUrl" TEXT;

CREATE UNIQUE INDEX "ProgramClub_slug_key" ON "ProgramClub"("slug");

-- CreateIndex
CREATE INDEX "ProgramClub_status_idx" ON "ProgramClub"("status");

-- CreateIndex
CREATE INDEX "ProgramClub_active_idx" ON "ProgramClub"("active");
