-- Internship HR workflow: interview scheduling and offer letter tracking
ALTER TABLE "CareerApplication"
  ADD COLUMN "interviewAt" TIMESTAMP(3),
  ADD COLUMN "interviewNote" TEXT,
  ADD COLUMN "offerRef" TEXT,
  ADD COLUMN "offerToken" TEXT,
  ADD COLUMN "offerIssuedAt" TIMESTAMP(3),
  ADD COLUMN "offerNotes" TEXT,
  ADD COLUMN "startDate" TIMESTAMP(3),
  ADD COLUMN "endDate" TIMESTAMP(3),
  ADD COLUMN "offerAcceptedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "CareerApplication_offerRef_key" ON "CareerApplication"("offerRef");
CREATE UNIQUE INDEX "CareerApplication_offerToken_key" ON "CareerApplication"("offerToken");
