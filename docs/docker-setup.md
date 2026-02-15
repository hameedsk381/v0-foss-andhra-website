# Docker Setup

## Local Stack (App + Postgres)

1. Review or update `.env.docker`.
2. If missing, create it from template:

```bash
cp .env.docker.example .env.docker
```
3. Start services:

```bash
docker compose up --build
```

This starts:
- `postgres` (local DB)
- `migrate` (one-shot `prisma migrate deploy`)
- `app` (Next.js standalone runtime)

App URL: `http://localhost:3000`

## Production Stack (External DB)

1. Create production env file:

```bash
cp .env.prod.example .env.prod
```

2. Fill `.env.prod` with real secrets.
3. Start production stack:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

This runs:
- `migrate` (one-shot migration job)
- `app` (web service)

## Notes

- The Docker image does **not** copy `.env`.
- Runtime runs as non-root user.
- Healthchecks are enabled for DB and app.
- Prisma migrations are executed as a separate service before app start.
