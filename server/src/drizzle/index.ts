import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'pg'
import { env } from '../env'

export const pg = new postgres.Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle({
  client: pg,
  logger: env.ENVIRONMENT === 'development',
})
