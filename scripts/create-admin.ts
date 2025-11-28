import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  
  const admin = await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@fossandhra.org",
      password: hashedPassword,
      role: "admin"
    }
  })
  
  console.log("Admin created:", admin)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
  })