import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// PrismaNeon uses Neon's WebSocket pooling protocol — works in Next.js API routes
// PrismaNeonHttp requires a non-optional options object in this version, so we use PrismaNeon
const adapter = new PrismaNeon({ connectionString })

export const prisma = global.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma