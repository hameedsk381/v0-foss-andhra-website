import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) {
          throw new Error("Invalid credentials")
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          admin.password
        )

        if (!isValidPassword) {
          throw new Error("Invalid credentials")
        }

        // Update last login
        await prisma.admin.update({
          where: { id: admin.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          userType: "admin"
        }
      }
    }),
    CredentialsProvider({
      id: "member-login",
      name: "Member Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const member = await prisma.member.findUnique({
          where: { email: credentials.email }
        })

        if (!member || !member.password) {
          throw new Error("Invalid credentials")
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          member.password
        )

        if (!isValidPassword) {
          throw new Error("Invalid credentials")
        }

        // Update last login
        await prisma.member.update({
          where: { id: member.id },
          data: { lastLogin: new Date() }
        })

        return {
          id: member.id,
          email: member.email,
          name: member.name,
          role: "member",
          userType: "member",
          membershipId: member.membershipId,
          status: member.status
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        ;(token as any).userType = (user as any).userType
        ;(token as any).membershipId = (user as any).membershipId
        ;(token as any).status = (user as any).status
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        ;(session.user as any).userType = (token as any).userType as string
        ;(session.user as any).membershipId = (token as any).membershipId as string
        ;(session.user as any).status = (token as any).status as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect based on user type after login
      if (url.includes("callbackUrl")) {
        const callbackUrl = new URL(url).searchParams.get("callbackUrl")
        if (callbackUrl) return callbackUrl
      }
      return baseUrl
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
