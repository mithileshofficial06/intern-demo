import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import * as dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL as string,
    adapter: () => new PrismaNeon(process.env.DATABASE_URL as string),
  },
})