-- Member public profiles: opt-in directory pages for FOSStar members
ALTER TABLE "Member"
  ADD COLUMN "publicSlug" TEXT,
  ADD COLUMN "profileVisible" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "publicBio" TEXT,
  ADD COLUMN "publicSkills" TEXT,
  ADD COLUMN "githubUrl" TEXT,
  ADD COLUMN "linkedinUrl" TEXT,
  ADD COLUMN "websiteUrl" TEXT;

CREATE UNIQUE INDEX "Member_publicSlug_key" ON "Member"("publicSlug");
