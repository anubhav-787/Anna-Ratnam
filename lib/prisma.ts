import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "./generated/prisma/client"

// Uses the POOLED connection string at runtime
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

// Singleton pattern — prevents exhausting connections in dev / serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma