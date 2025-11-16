import { z } from 'zod'

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address')
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{7,14}$/, 'Invalid phone number')
export const urlSchema = z.string().url('Invalid URL')

// Member schemas
export const createMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: emailSchema,
  phone: phoneSchema,
  organization: z.string().optional(),
  designation: z.string().optional(),
  experience: z.string().optional(),
  interests: z.string().optional(),
  referral: z.string().optional(),
  membershipType: z.enum(['FOSStar Annual', 'FOSStar Lifetime', 'FOSServe', 'FOSSynC']),
})

export const updateMemberSchema = createMemberSchema.partial()

// Event schemas
export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  time: z.string(),
  location: z.string().min(3, 'Location is required'),
  type: z.string(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  maxAttendees: z.number().int().positive().optional(),
  program: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  externalTicketUrl: z.string().url().optional().or(z.literal('')),
  externalRegisterUrl: z.string().url().optional().or(z.literal('')),
})

export const updateEventSchema = createEventSchema.partial()

// Donation schemas
export const createDonationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  amount: z.number().positive('Amount must be positive').min(1, 'Minimum donation is ₹1'),
  type: z.enum(['one-time', 'monthly', 'annual']),
  anonymous: z.boolean().default(false),
  program: z.string().optional(),
  notes: z.string().max(500).optional(),
})

// Blog post schemas
export const createBlogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(500),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().cuid(),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().max(255).optional(),
  focusKeyword: z.string().max(100).optional(),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

// Volunteer schemas
export const createVolunteerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  skills: z.string().min(3, 'Please describe your skills'),
  interests: z.string().min(3, 'Please describe your interests'),
  availability: z.string().min(3, 'Please describe your availability'),
})

// Newsletter schemas
export const subscribeNewsletterSchema = z.object({
  email: emailSchema,
  name: z.string().min(2).optional(),
})

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(2000),
})

// Payment verification schema
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

// Program content schemas
export const createProgramInitiativeSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  content: z.string().optional(),
  icon: z.string().optional(),
  category: z.string().optional(),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
})

export const createProgramTeamMemberSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  bio: z.string().optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  email: emailSchema.optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
})

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// Login schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Helper function to validate request body
export async function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await schema.parseAsync(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return {
        success: false,
        error: firstError.message,
      }
    }
    return {
      success: false,
      error: 'Validation failed',
    }
  }
}
