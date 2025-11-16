import { describe, it, expect } from 'vitest'
import { validateEnv } from './env-validator'

describe('Environment Validation', () => {
  it('should validate required environment variables', () => {
    const originalEnv = process.env
    
    process.env = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/test',
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'a'.repeat(32),
      NODE_ENV: 'test',
    } as any

    expect(() => validateEnv()).not.toThrow()
    
    process.env = originalEnv
  })

  it('should throw error for missing DATABASE_URL', () => {
    const originalEnv = process.env
    
    process.env = {
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'a'.repeat(32),
      NODE_ENV: 'test',
    } as any

    expect(() => validateEnv()).toThrow()
    
    process.env = originalEnv
  })

  it('should throw error for short NEXTAUTH_SECRET', () => {
    const originalEnv = process.env
    
    process.env = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/test',
      NEXTAUTH_URL: 'http://localhost:3000',
      NEXTAUTH_SECRET: 'short',
      NODE_ENV: 'test',
    } as any

    expect(() => validateEnv()).toThrow()
    
    process.env = originalEnv
  })
})
