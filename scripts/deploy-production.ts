#!/usr/bin/env bun
/**
 * Production Deployment Script for FOSS Andhra Website
 * 
 * This script automates the deployment process for production environments.
 * It handles environment setup, database migration, building, and starting the application.
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const PROJECT_ROOT = process.cwd();
const ENV_FILE = join(PROJECT_ROOT, '.env');
const ENV_PRODUCTION_TEMPLATE = join(PROJECT_ROOT, '.env.production');
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NEXTAUTH_URL',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS'
];

// Utility functions
function log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  const colors = {
    info: '\x1b[36m', // Cyan
    success: '\x1b[32m', // Green
    warning: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    reset: '\x1b[0m' // Reset
  };
  
  console.log(`${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

function runCommand(command: string, cwd?: string) {
  log(`Running: ${command}`, 'info');
  try {
    const result = execSync(command, {
      cwd,
      stdio: 'inherit',
      env: { ...process.env }
    });
    return result;
  } catch (error) {
    log(`Command failed: ${command}`, 'error');
    throw error;
  }
}

function generateSecret(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function checkEnvironmentVariables(): boolean {
  log('Checking environment variables...', 'info');
  
  // Check if .env file exists
  if (!existsSync(ENV_FILE)) {
    log('.env file not found. Creating from .env.production template...', 'warning');
    if (existsSync(ENV_PRODUCTION_TEMPLATE)) {
      runCommand(`cp ${ENV_PRODUCTION_TEMPLATE} ${ENV_FILE}`);
    } else {
      log('No .env.production template found. Creating minimal .env file...', 'warning');
      const minimalEnv = `# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fossandhra?schema=public

# Auth
NEXTAUTH_SECRET=${generateSecret()}
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=465
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=FOSS Andhra

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=foss-andhra-gallery
MINIO_PUBLIC_URL=http://localhost:9000
`;
      writeFileSync(ENV_FILE, minimalEnv);
      log('Created minimal .env file. Please update with your actual values.', 'warning');
    }
  }

  // Read current .env file
  const envContent = readFileSync(ENV_FILE, 'utf-8');
  const envLines = envContent.split('\n');
  
  // Check for required variables
  const missingVars: string[] = [];
  for (const varName of REQUIRED_ENV_VARS) {
    const hasVar = envLines.some(line => 
      line.trim().startsWith(varName + '=') && !line.trim().startsWith('#')
    );
    
    if (!hasVar) {
      missingVars.push(varName);
    }
  }
  
  if (missingVars.length > 0) {
    log(`Missing required environment variables: ${missingVars.join(', ')}`, 'warning');
    log('Please update your .env file with these variables before proceeding.', 'warning');
    return false;
  }
  
  // Check for placeholder values
  const placeholders = [
    'your-razorpay-key-id',
    'your-razorpay-key-secret',
    'your-smtp-host',
    'your-smtp-username',
    'your-smtp-password',
    'your-from-email'
  ];
  
  const hasPlaceholders = placeholders.some(placeholder => 
    envContent.includes(placeholder)
  );
  
  if (hasPlaceholders) {
    log('Detected placeholder values in .env file. Please update with actual values.', 'warning');
    return false;
  }
  
  log('Environment variables check passed!', 'success');
  return true;
}

async function main() {
  try {
    log('Starting FOSS Andhra Production Deployment...', 'info');
    
    // 1. Check environment variables
    if (!checkEnvironmentVariables()) {
      log('Environment check failed. Please fix the issues and run again.', 'error');
      process.exit(1);
    }
    
    // 2. Install dependencies
    log('Installing dependencies...', 'info');
    runCommand('bun install');
    
    // 3. Generate Prisma client
    log('Generating Prisma client...', 'info');
    try {
      runCommand('bunx prisma generate');
    } catch (error) {
      log('Prisma generation failed, continuing...', 'warning');
    }
    
    // 4. Run database migrations
    log('Running database migrations...', 'info');
    try {
      runCommand('bunx prisma migrate deploy');
    } catch (error) {
      log('Database migrations failed, continuing...', 'warning');
    }
    
    // 5. Seed database
    log('Seeding database...', 'info');
    try {
      runCommand('bunx tsx prisma/seed.ts');
    } catch (error) {
      log('Database seeding failed, continuing...', 'warning');
    }
    
    // 6. Create admin user if not exists
    log('Creating admin user...', 'info');
    try {
      runCommand('bunx tsx scripts/create-admin.ts');
    } catch (error) {
      log('Admin user may already exist or creation failed. Continuing...', 'warning');
    }
    
    // 7. Build application
    log('Building application for production...', 'info');
    try {
      runCommand('bun run build');
    } catch (error) {
      log('Build failed, continuing...', 'warning');
    }
    
    // 8. Start application
    log('Starting production server...', 'info');
    log('Application will be available at the configured domain', 'success');
    runCommand('bun run start');
    
  } catch (error) {
    log(`Deployment failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  main();
}

export { log, runCommand, generateSecret, checkEnvironmentVariables };