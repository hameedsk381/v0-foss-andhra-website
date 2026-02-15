FROM oven/bun:1.2.1-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM deps AS builder
COPY . .
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=foss_app
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN bunx prisma generate
RUN bun run build

FROM deps AS migrator
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY package.json bun.lock ./
ARG DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=foss_app
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production
CMD ["bunx", "prisma", "migrate", "deploy"]

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl dumb-init
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 CMD curl -fsS http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["dumb-init", "node", "server.js"]
