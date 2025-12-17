import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/server.ts'],
	format: ['esm'],
	target: 'node18',
	outDir: 'dist',
	clean: true,
	sourcemap: false,
	minify: false,
	splitting: false,
	treeshake: true,
	dts: false,
	shims: true,
	skipNodeModulesBundle: true,
	external: [
		'fastify',
		'@fastify/cors',
		'@fastify/swagger',
		'@fastify/swagger-ui',
		'fastify-type-provider-zod',
		'drizzle-orm',
		'pg',
		'bcrypt',
		'jsonwebtoken',
		'date-fns',
		'@date-fns/tz',
		'node-cron',
		'zod'
	]
});
