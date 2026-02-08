
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const name = "Test User"
    const email = "testuser@fossap.in"
    const phone = "9999999999"
    const password = "password123"
    const hashedPassword = await bcrypt.hash(password, 10)
    const membershipId = `FOSS${Date.now()}`
    const expiryDate = new Date()
    expiryDate.setFullYear(expiryDate.getFullYear() + 1)

    console.log(`Creating test user: ${name} (${email})...`)

    try {
        const user = await prisma.member.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                status: "active",
                membershipId,
                expiryDate,
            },
            create: {
                name,
                email,
                phone,
                password: hashedPassword,
                membershipType: "FOSStar Annual",
                status: "active",
                membershipId,
                expiryDate,
                joinDate: new Date(),
            },
        })

        console.log("✅ Test user created/updated successfully!")
        console.log(`Email: ${email}`)
        console.log(`Password: ${password}`)
        console.log(`Membership ID: ${user.membershipId}`)
    } catch (error) {
        console.error("❌ Error creating test user:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
