-- Careers: openings (jobs, internships, fellowships, ...) and applications.
CREATE TABLE "CareerOpening" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'job',
    "department" TEXT,
    "location" TEXT NOT NULL DEFAULT 'Andhra Pradesh',
    "workMode" TEXT NOT NULL DEFAULT 'onsite',
    "summary" TEXT,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "benefits" TEXT,
    "compensation" TEXT,
    "applyDeadline" TIMESTAMP(3),
    "externalApplyUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerOpening_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CareerApplication" (
    "id" TEXT NOT NULL,
    "openingId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "profileUrl" TEXT,
    "coverLetter" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CareerOpening_slug_key" ON "CareerOpening"("slug");
CREATE INDEX "CareerOpening_status_idx" ON "CareerOpening"("status");
CREATE INDEX "CareerOpening_type_idx" ON "CareerOpening"("type");
CREATE INDEX "CareerApplication_openingId_idx" ON "CareerApplication"("openingId");
CREATE INDEX "CareerApplication_status_idx" ON "CareerApplication"("status");
CREATE INDEX "CareerApplication_email_idx" ON "CareerApplication"("email");

ALTER TABLE "CareerApplication" ADD CONSTRAINT "CareerApplication_openingId_fkey"
    FOREIGN KEY ("openingId") REFERENCES "CareerOpening"("id") ON DELETE SET NULL ON UPDATE CASCADE;
