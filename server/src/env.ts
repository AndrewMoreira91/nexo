import z from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
	ENVIRONMENT: z.enum(['development', 'production']).default('development'),
})

export const env = envSchema.parse(process.env)
