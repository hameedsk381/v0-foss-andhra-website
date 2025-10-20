// Database Schema for FOSS Andhra CMS
// This file defines the structure for the database tables
// Can be used with Prisma, Drizzle ORM, or any other ORM

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  organization?: string
  designation?: string
  experience?: string
  interests?: string
  referral?: string
  membershipType: "FOSStar Annual" | "Lifetime"
  status: "active" | "expired" | "pending" | "cancelled"
  joinDate: Date
  expiryDate: Date
  paymentId?: string
  membershipId: string
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string
  date: Date
  endDate?: Date
  time: string
  location: string
  type: "Conference" | "Workshop" | "Hackathon" | "Meetup" | "Training"
  status: "draft" | "upcoming" | "ongoing" | "past" | "cancelled"
  maxAttendees?: number
  currentAttendees: number
  program?: string // fosstar, fosserve, etc.
  imageUrl?: string
  registrationLink?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface Donation {
  id: string
  name: string
  email: string
  phone: string
  amount: number
  type: "oneTime" | "monthly" | "programSponsorship"
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled"
  anonymous: boolean
  paymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
  program?: string
  notes?: string
  receiptUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface EventRegistration {
  id: string
  eventId: string
  name: string
  email: string
  phone: string
  organization?: string
  status: "registered" | "attended" | "cancelled"
  registrationDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Content {
  id: string
  type: "page" | "program" | "blog" | "announcement"
  slug: string
  title: string
  content: string // Rich text content
  metaDescription?: string
  keywords?: string[]
  status: "draft" | "published" | "archived"
  author: string
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  alt?: string
  caption?: string
  uploadedBy: string
  createdAt: Date
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string // hashed
  role: "admin" | "editor" | "viewer"
  avatar?: string
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Settings {
  id: string
  key: string
  value: string
  description?: string
  updatedAt: Date
}

// For newsletter subscriptions
export interface Subscriber {
  id: string
  email: string
  name?: string
  status: "active" | "unsubscribed"
  subscribedAt: Date
  unsubscribedAt?: Date
}

// For volunteer applications
export interface Volunteer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  skills: string
  interests: string
  availability: string
  status: "pending" | "approved" | "rejected"
  appliedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
}
