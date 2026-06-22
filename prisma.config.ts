import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL!,
    adapter: () => new PrismaNeon(process.env.DATABASE_URL!)
  }
})
