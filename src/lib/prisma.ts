import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// 1. Define a function that creates the extended client
const makeClient = () => {
  return new PrismaClient().$extends(withAccelerate())
}

// 2. Define the type of our extended client
type PrismaClientExtended = ReturnType<typeof makeClient>

// 3. Setup the global object for development hot-reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientExtended | undefined
}

// 4. Export the singleton instance
export const prisma = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma