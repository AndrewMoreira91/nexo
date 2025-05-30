import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
	ENVIRONMENT: z.enum(["development", "production"]).default("development"),
	PRODUCTION_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);
