# DB Drift Report (2026-02-15)

## Scope
- Workspace: `v0-foss-andhra-website`
- Target DB: datasource from `prisma/schema.prisma` (`public` schema on configured PostgreSQL)
- Goal: identify drift and provide a safe migration plan without destructive changes.

## Commands Run
- `npx prisma migrate status`
- `npx prisma db pull --print`
- `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script --output prisma/_drift_from_db_to_schema.sql`

## Findings
1. No Prisma migration history in repo:
- `prisma/migrations` directory is missing.

2. Database shares `public` schema with many unrelated tables:
- Introspection shows many non-app tables (`accounts`, `events`, `orders`, `products`, etc.).
- Auto-generated full diff (`prisma/_drift_from_db_to_schema.sql`) starts with many `DROP TABLE "public".*` statements for those tables.

3. App-schema drift confirmed:
- Missing `Member` columns:
  - `address`
  - `resetToken`
  - `resetTokenExpiry`
- Missing app tables:
  - `Inquiry`
  - `PushSubscription`
  - `Registration`
  - `EventTicketType`
  - `EventOrder`
  - `EventTicket`
  - `EventPromoCode`
  - `PromoCodeTicket`

4. Runtime impact observed before patching API fallbacks:
- Member dashboard failed when `Registration` table missing.
- Member auth/profile paths failed when Prisma selected non-existent `Member` columns.
- Admin blog category/tag APIs had Prisma relation-count key mismatch (fixed in app code).

## Safe Migration Plan (Additive Only)
Use only:
- `prisma/manual-migrations/2026-02-15_additive_drift_fix.sql`

This script:
- Adds missing `Member` columns and unique index.
- Creates the 8 missing app tables.
- Adds required indexes and FK constraints.
- Avoids all `DROP` operations.

## Rollout Procedure
1. Take DB backup/snapshot.
2. Apply script in a maintenance window:
   - `npx prisma db execute --schema prisma/schema.prisma --file prisma/manual-migrations/2026-02-15_additive_drift_fix.sql`
3. Regenerate Prisma client:
   - `npx prisma generate`
4. Run smoke checks for:
   - `/api/member/dashboard`
   - `/api/member/profile`
   - `/api/member/preferences`
   - `/api/admin/members`
   - `/api/admin/events/[id]/promo-codes`
5. Keep `prisma/_drift_from_db_to_schema.sql` for reference only. Do not execute it against this shared DB.

## Strategic Recommendation
To eliminate future destructive-diff risk:
- Move this app to a dedicated DB or dedicated schema (e.g. `foss_app`) and set `DATABASE_URL` accordingly.
- Introduce formal migration history with Prisma Migrate from this point forward.
