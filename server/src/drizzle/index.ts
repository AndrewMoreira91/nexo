import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'pg'
import { env } from '../env'

export const pg = new postgres.Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle({
  client: pg,
  // logger: isDevelopment(),
})

db.$client.connect().then(() => {
  console.log('Connected to the database')
}).catch((err) => {
  console.error(err)
  throw new Error(`Failed to connect to the database`)
})

