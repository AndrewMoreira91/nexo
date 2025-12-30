import type { FastifyInstance } from "fastify";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import z from "zod";
import { env } from "../env";
import { isDevelopment } from "../utils/chose-environment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function rootRoute(app: FastifyInstance) {
	app.get(
		"/",
		{
			schema: {
				tags: ["root"],
				response: {
					201: z.string(),
				},
			},
		},
		async (request, reply) => {
			const docsUrl = isDevelopment()
				? `http://localhost:${env.PORT}/docs`
				: `${env.PRODUCTION_URL}/docs`;

			const htmlTemplate = readFileSync(
				join(__dirname, '..', 'views', 'index.html'),
				'utf-8'
			);

			const html = htmlTemplate
				.replace('{{DOCS_URL}}', docsUrl)
				.replace('{{WEB_APP_LINK}}', isDevelopment()
					? '<a href="http://localhost:5173" class="secondary">🌐 Aplicação Web (Dev)</a>'
					: '')
				.replace('{{ENVIRONMENT}}', isDevelopment() ? 'Desenvolvimento' : 'Produção')
				.replace('{{PORT}}', env.PORT.toString());

			return reply.type("text/html").send(html);
		},
	);
}
