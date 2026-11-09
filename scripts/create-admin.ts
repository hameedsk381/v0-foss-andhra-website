import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Creates or updates the primary admin from ADMIN_EMAIL / ADMIN_PASSWORD (set in .env).
// Note: logging in with these credentials also syncs the admin automatically.
const prisma = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME?.trim() || "Admin"

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running this script.")
  }

  const hashed = await bcrypt.hash(password, 10)
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name, password: hashed, role: "admin" },
    create: { name, email, password: hashed, role: "admin" },
    select: { id: true, email: true, name: true, role: true },
  })

  console.log("Admin ready:", admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
