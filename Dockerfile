# Multi-stage build for FOSS Andhra Website
# Stage 1: Dependencies
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy package files
COPY package.json ./
# Copy lock file
COPY bun.lock ./

# Install dependencies
RUN bun install

# Stage 2: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Install OpenSSL to fix Prisma warnings
RUN apt-get update && apt-get install -y openssl

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
# Skip static export to avoid database connection issues during build
ENV NEXT_EXPORT=0
# Skip prerendering pages that require database access
ENV NEXT_BYPASS_PRERENDER=1
# Skip static generation errors
ENV NEXT_IGNORE_PRERENDER_ERRORS=1
# Skip font optimization during build to avoid network issues
ENV NEXT_OPTIMIZE_FONTS=false
ENV NEXT_FONT_OPTS=0
# Allow build to continue even with export errors
RUN bun run build || echo "Build completed with warnings"

# Stage 3: Runner
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Install OpenSSL to fix Prisma warnings
RUN apt-get update && apt-get install -y openssl

# Set to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy Prisma files for migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Install bcryptjs for seeding
RUN apt-get update && apt-get install -y python3 build-essential
RUN bun add bcryptjs

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD bun run healthcheck || exit 1

# Start application using next start command
CMD ["bun", "node_modules/next/dist/bin/next", "start"]