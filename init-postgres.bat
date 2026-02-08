@echo off
echo Setting up PostgreSQL for FOSS Andhra Website...

REM check if docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo Starting PostgreSQL via Docker Compose...
docker-compose up -d postgres

echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo Running database migrations...
call bunx prisma migrate dev --name init_postgres

echo Seeding database...
call bunx prisma db seed

echo Setup complete! You can now run 'bun run dev'
pause
