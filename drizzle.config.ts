import { defineConfig } from 'drizzle-kit';
import { env } from './src/env';

export default defineConfig({
	out: './src/drizzle/migrations',
	schema: './src/drizzle/schemas/*.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
