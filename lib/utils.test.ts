import { describe, it, expect } from 'vitest'
import { clsx } from 'clsx'

describe('Utils Tests', () => {
  describe('clsx utility', () => {
    it('should combine class names correctly', () => {
      const result = clsx('btn', 'btn-primary', { active: true, disabled: false })
      expect(result).toContain('btn')
      expect(result).toContain('active')
      expect(result).not.toContain('disabled')
    })

    it('should handle empty inputs', () => {
      const result = clsx()
      expect(result).toBe('')
    })

    it('should filter falsy values', () => {
      const result = clsx('btn', null, undefined, false, 'primary')
      expect(result).toBe('btn primary')
    })
  })
})
