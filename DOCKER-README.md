# Running FOSS Andhra Website with Docker

This guide explains how to build and run the FOSS Andhra website using Docker without Docker Compose.

## Prerequisites

1. Docker installed on your system
2. A separate PostgreSQL database instance running (not managed by this Docker setup)

## Building the Docker Image

```bash
docker build -t foss-andhra-website .
```

## Running the Container

You can run the container using either the provided scripts or manually with docker run:

### Option 1: Using the provided scripts

For Linux/Mac:
```bash
chmod +x build-and-run.sh
./build-and-run.sh
```

For Windows:
```cmd
build-and-run.bat
```

### Option 2: Manual docker run command

```bash
docker run -d \
  --name foss-app \
  -p 3001:3000 \
  -e DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public" \
  -e NEXTAUTH_URL="http://localhost:3001" \
  -e NEXTAUTH_SECRET="your-nextauth-secret" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3001" \
  -e NODE_ENV="production" \
  foss-andhra-website
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: Connection string to your PostgreSQL database
- `NEXTAUTH_URL`: The URL of your application (e.g., http://localhost:3001)
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js
- `NEXT_PUBLIC_APP_URL`: The public URL of your application
- `NODE_ENV`: Set to "production" for production deployments

## Database Setup

Make sure your PostgreSQL database is set up with the correct schema. You can run the Prisma migrations manually:

```bash
npx prisma migrate deploy
```

Or use the seed script to populate initial data:

```bash
bun run prisma/seed.ts
```

## Accessing the Application

Once the container is running, you can access the application at:

http://localhost:3001

## Troubleshooting

If you encounter issues:

1. Check that your PostgreSQL database is accessible from the Docker container
2. Verify all environment variables are correctly set
3. Check the container logs with `docker logs foss-app`