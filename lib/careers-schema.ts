import { z } from "zod"
import { OPENING_STATUSES, OPENING_TYPES, WORK_MODES } from "@/lib/careers"

const emptyToNull = (v: unknown) => (typeof v === "string" && v.trim() === "" ? null : v)
const httpUrl = z.preprocess(
  emptyToNull,
  z
    .string()
    .trim()
    .max(500)
    .refine((v) => /^https?:\/\/\S+$/i.test(v), "Apply link must start with http:// or https://")
    .nullable()
    .optional(),
)
const optText = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max).nullable().optional())

export const openingSchema = z.object({
  title: z.string().trim().min(3).max(150),
  slug: z.string().trim().max(100).optional(),
  type: z.enum(OPENING_TYPES.map((t) => t.value) as [string, ...string[]]),
  workMode: z.enum(WORK_MODES.map((m) => m.value) as [string, ...string[]]),
  status: z.enum(OPENING_STATUSES),
  location: z.string().trim().min(2).max(150),
  department: optText(100),
  summary: optText(300),
  description: z.string().trim().min(10).max(20000),
  requirements: optText(20000),
  benefits: optText(20000),
  compensation: optText(150),
  applyDeadline: z.preprocess(emptyToNull, z.coerce.date().nullable().optional()),
  externalApplyUrl: httpUrl,
  featured: z.boolean().optional(),
})
