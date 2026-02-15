# Dedicated Schema Plan (`foss_app`)

## Why
Your current database uses shared `public` schema with unrelated product tables.  
Prisma diff/migrate interprets those as drift and generates destructive SQL (`DROP TABLE public.*`).

Using a dedicated schema isolates app objects and makes Prisma migrations safe and predictable.

## Prepared Artifacts
- Move script: `prisma/manual-migrations/2026-02-15_move_app_tables_to_foss_app.sql`
- Additive drift fix script: `prisma/manual-migrations/2026-02-15_additive_drift_fix.sql`
- Prisma config: `prisma.config.ts`
- Baseline migration for fresh environments: `prisma/migrations/20260215173000_baseline/migration.sql`

## Rollout Steps
1. Backup DB.
2. Ensure additive drift is already applied:
   - `npx prisma db execute --schema prisma/schema.prisma --file prisma/manual-migrations/2026-02-15_additive_drift_fix.sql`
3. Move app tables to dedicated schema:
   - `npx prisma db execute --schema prisma/schema.prisma --file prisma/manual-migrations/2026-02-15_move_app_tables_to_foss_app.sql`
4. Update `DATABASE_URL` to use `schema=foss_app`.
5. Regenerate Prisma client:
   - `npx prisma generate`
6. Validate:
   - `npx prisma db pull --print`
   - `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`
   - Confirm no `DROP TABLE "public".*` for unrelated systems.
7. Run smoke checks on admin/member APIs.

## Rollback (if needed)
Create reverse move script by changing:
- `ALTER TABLE IF EXISTS public.%I SET SCHEMA foss_app;`
to
- `ALTER TABLE IF EXISTS foss_app.%I SET SCHEMA public;`

Run it with `prisma db execute` after backup.

## Notes
- Keep third-party tables in `public`; keep FOSS Andhra tables in `foss_app`.
- From this point, use Prisma Migrate (`migrate dev/deploy`) against the dedicated schema only.
