import { prisma } from './lib/prisma'

async function main() {
  try {
    console.log('Fetching appConfigs...')
    const configs = await prisma.appConfig.findMany()
    console.log('App configs:', configs)
  } catch (error) {
    console.error('Error querying database:', error)
  } finally {
    // Under some prisma neon setups, we need to end process to close connection/pool
    process.exit(0)
  }
}

main()
