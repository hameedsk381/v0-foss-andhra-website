-- Member public profiles become public by default (opt-out instead of opt-in)
ALTER TABLE "Member" ALTER COLUMN "profileVisible" SET DEFAULT true;

-- Every member gets a public profile
UPDATE "Member" SET "profileVisible" = true;

-- Backfill a stable public slug for every member that does not have one yet.
-- Slug = ascii-safe name (capped at 40 chars) + 12-char id suffix for guaranteed uniqueness.
-- Existing slugs are left untouched; slugs are assigned once and never regenerated.
UPDATE "Member"
SET "publicSlug" = left(
  btrim(
    left(regexp_replace(trim("name"), '[^a-zA-Z0-9]+', '-', 'g'), 40) || '-' || left("id", 12),
    '-'
  ),
  52
)
WHERE "publicSlug" IS NULL;
