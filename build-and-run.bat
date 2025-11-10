@echo off
echo Building Docker image...
docker build -t foss-andhra-website .

echo Running container on port 3001...
docker run -d ^
  --name foss-app ^
  -p 3001:3000 ^
  -e DATABASE_URL="postgresql://fossandhra:changeme@host.docker.internal:5432/fossandhra?schema=public" ^
  -e NEXTAUTH_URL="http://localhost:3001" ^
  -e NEXTAUTH_SECRET="1234567890987654321234567890" ^
  -e NEXT_PUBLIC_APP_URL="http://localhost:3001" ^
  -e NODE_ENV="production" ^
  foss-andhra-website

echo Application is now running on http://localhost:3001
echo Make sure your PostgreSQL database is running separately and accessible.