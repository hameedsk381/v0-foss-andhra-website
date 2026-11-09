import crypto from "crypto"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

/**
 * Primary admin credentials come from the environment:
 *   ADMIN_EMAIL     login identifier (also used for admin notification emails)
 *   ADMIN_PASSWORD  login password
 *   ADMIN_NAME      optional display name (default "Admin")
 *
 * The matching Admin row is created/updated on login so relations (e.g. blog
 * authors) keep a real foreign key. Changing the env values takes effect on the
 * next login. Both values must be set, otherwise this feature is disabled.
 */
export interface EnvAdminConfig {
  email: string
  password: string
  name: string
}

export function getEnvAdminConfig(): EnvAdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return null
  // Never accept the example placeholder or a trivially short password.
  if (password.length < 8 || /^(replace-with|change-me)/i.test(password)) {
    console.warn("ADMIN_PASSWORD is a placeholder or shorter than 8 characters; env admin login is disabled.")
    return null
  }
  return { email, password, name: process.env.ADMIN_NAME?.trim() || "Admin" }
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest()
  const hb = crypto.createHash("sha256").update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function isEnvAdminEmail(email: string, config: EnvAdminConfig): boolean {
  return email.trim().toLowerCase() === config.email
}

export function verifyEnvAdminPassword(password: string, config: EnvAdminConfig): boolean {
  return safeEqual(password, config.password)
}

/** Ensure an Admin row exists for the env admin with a hash of the current env password. */
export async function syncEnvAdmin(config: EnvAdminConfig) {
  const existing = await prisma.admin.findUnique({ where: { email: config.email } })

  if (!existing) {
    return prisma.admin.create({
      data: {
        name: config.name,
        email: config.email,
        password: await bcrypt.hash(config.password, 10),
        role: "admin",
      },
    })
  }

  const passwordUnchanged = await bcrypt.compare(config.password, existing.password)
  if (passwordUnchanged && existing.role === "admin") return existing

  return prisma.admin.update({
    where: { id: existing.id },
    data: {
      role: "admin",
      ...(passwordUnchanged ? {} : { password: await bcrypt.hash(config.password, 10) }),
    },
  })
}
