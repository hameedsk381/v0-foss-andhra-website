#!/usr/bin/env bun
import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupDir = path.join(process.cwd(), 'backups')
  const backupFile = path.join(backupDir, `fossandhra_${timestamp}.sql`)

  try {
    // Create backups directory if it doesn't exist
    await fs.mkdir(backupDir, { recursive: true })

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not found in environment variables')
    }

    // Parse PostgreSQL URL
    const url = new URL(databaseUrl)
    const dbName = url.pathname.slice(1)
    const user = url.username
    const password = url.password
    const host = url.hostname
    const port = url.port || '5432'

    console.log(`🗄️  Starting database backup...`)
    console.log(`📁 Backup location: ${backupFile}`)

    // Set password as environment variable for pg_dump
    const env = { ...process.env, PGPASSWORD: password }

    // Execute pg_dump
    const command = `pg_dump -h ${host} -p ${port} -U ${user} -F p -f "${backupFile}" ${dbName}`
    
    const { stdout, stderr } = await execAsync(command, { env })
    
    if (stderr && !stderr.includes('WARNING')) {
      console.error('⚠️  Backup warnings:', stderr)
    }

    // Verify backup file exists and has content
    const stats = await fs.stat(backupFile)
    if (stats.size === 0) {
      throw new Error('Backup file is empty')
    }

    console.log(`✅ Backup completed successfully!`)
    console.log(`📊 Backup size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)

    // Keep only last 7 backups
    await cleanOldBackups(backupDir, 7)

    return backupFile
  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  }
}

async function cleanOldBackups(backupDir: string, keepCount: number) {
  try {
    const files = await fs.readdir(backupDir)
    const backupFiles = files
      .filter((file) => file.startsWith('fossandhra_') && file.endsWith('.sql'))
      .map(async (file) => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: (await fs.stat(path.join(backupDir, file))).mtime,
      }))

    const backups = await Promise.all(backupFiles)
    const sortedBackups = backups.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

    // Delete old backups
    const toDelete = sortedBackups.slice(keepCount)
    for (const backup of toDelete) {
      await fs.unlink(backup.path)
      console.log(`🗑️  Deleted old backup: ${backup.name}`)
    }

    if (toDelete.length > 0) {
      console.log(`🧹 Cleaned up ${toDelete.length} old backup(s)`)
    }
  } catch (error) {
    console.error('⚠️  Error cleaning old backups:', error)
  }
}

// Run backup
backupDatabase()
