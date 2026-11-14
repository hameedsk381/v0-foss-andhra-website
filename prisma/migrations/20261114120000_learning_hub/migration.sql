-- Learning Hub: tracks, lessons and member progress
CREATE TABLE "LearningTrack" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'beginner',
    "estimatedHours" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningTrack_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningLesson" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 10,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningLesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningProgress" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningTrack_slug_key" ON "LearningTrack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningLesson_trackId_slug_key" ON "LearningLesson"("trackId", "slug");

-- CreateIndex
CREATE INDEX "LearningLesson_trackId_idx" ON "LearningLesson"("trackId");

-- CreateIndex
CREATE INDEX "LearningLesson_status_idx" ON "LearningLesson"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LearningProgress_memberId_lessonId_key" ON "LearningProgress"("memberId", "lessonId");

-- CreateIndex
CREATE INDEX "LearningProgress_memberId_idx" ON "LearningProgress"("memberId");

-- CreateIndex
CREATE INDEX "LearningProgress_lessonId_idx" ON "LearningProgress"("lessonId");

-- AddForeignKey
ALTER TABLE "LearningLesson" ADD CONSTRAINT "LearningLesson_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "LearningTrack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningProgress" ADD CONSTRAINT "LearningProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "LearningLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
