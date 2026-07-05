-- Member email verification
ALTER TABLE "Member" ADD COLUMN "emailVerified" TIMESTAMP(3);
ALTER TABLE "Member" ADD COLUMN "verifyToken" TEXT;
ALTER TABLE "Member" ADD COLUMN "verifyTokenExpiry" TIMESTAMP(3);

CREATE UNIQUE INDEX "Member_verifyToken_key" ON "Member"("verifyToken");

-- Existing members who already set a password proved mailbox ownership via
-- the emailed set-password link; grandfather them in so they aren't locked out.
UPDATE "Member" SET "emailVerified" = CURRENT_TIMESTAMP
WHERE "password" IS NOT NULL AND "resetToken" IS NULL;
