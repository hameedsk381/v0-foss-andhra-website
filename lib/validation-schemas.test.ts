import { describe, it, expect } from 'vitest'
import {
  emailSchema,
  phoneSchema,
  passwordSchema,
  createMemberSchema,
  subscribeNewsletterSchema,
  validateRequestBody,
} from './validation-schemas'

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      expect(emailSchema.safeParse('user@example.com').success).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(emailSchema.safeParse('invalid-email').success).toBe(false)
      expect(emailSchema.safeParse('user@').success).toBe(false)
      expect(emailSchema.safeParse('@example.com').success).toBe(false)
    })
  })

  describe('phoneSchema', () => {
    it('should validate correct phone numbers', () => {
      expect(phoneSchema.safeParse('+919876543210').success).toBe(true)
      expect(phoneSchema.safeParse('9876543210').success).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(phoneSchema.safeParse('123').success).toBe(false)
      expect(phoneSchema.safeParse('abc').success).toBe(false)
    })
  })

  describe('passwordSchema', () => {
    it('should validate strong password', () => {
      expect(passwordSchema.safeParse('MyP@ssw0rd!').success).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(passwordSchema.safeParse('short').success).toBe(false)
      expect(passwordSchema.safeParse('alllowercase').success).toBe(false)
      expect(passwordSchema.safeParse('NoNumbers!').success).toBe(false)
      expect(passwordSchema.safeParse('NoSpecialChar1').success).toBe(false)
    })
  })

  describe('createMemberSchema', () => {
    it('should validate correct member data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        membershipType: 'FOSStar Annual',
      }
      expect(createMemberSchema.safeParse(validData).success).toBe(true)
    })

    it('should reject invalid member data', () => {
      const invalidData = {
        name: 'J',
        email: 'invalid-email',
        phone: '123',
        membershipType: 'Invalid Type',
      }
      expect(createMemberSchema.safeParse(invalidData).success).toBe(false)
    })
  })

  describe('validateRequestBody', () => {
    it('should return success for valid data', async () => {
      const result = await validateRequestBody(subscribeNewsletterSchema, {
        email: 'test@example.com',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
      }
    })

    it('should return error for invalid data', async () => {
      const result = await validateRequestBody(subscribeNewsletterSchema, {
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeTruthy()
      }
    })
  })
})
