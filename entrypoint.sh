#!/bin/sh
set -e

# Run migrations if database is available
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  # Use the globally installed prisma if possible, or npx
  if command -v prisma >/dev/null 2>&1; then
    prisma migrate deploy
  else
    npx prisma migrate deploy
  fi
fi

# Start the application
echo "Starting application..."
exec node server.js
