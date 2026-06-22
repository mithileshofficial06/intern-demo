import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// PrismaNeonHttp uses Neon's HTTP protocol — no WebSocket/ws needed,
// works in Next.js API routes and serverless functions out of the box.
const adapter = new PrismaNeonHttp(connectionString)

export const prisma = global.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma