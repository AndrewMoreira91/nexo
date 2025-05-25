import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import cron from "node-cron";
import { env } from "./env";
import { dailyDataUpdate } from "./functions/dailyUpdate/daily-data-update";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PUT", "DELETE"],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Nexo API",
			version: "0.1.0",
		},
		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: "Development server",
			},
			...(env.ENVIRONMENT === "production" && env.PRODUCTION_URL
				? [
						{
							url: env.PRODUCTION_URL,
							description: "Production server",
						},
					]
				: []),
		],
		tags: [
			{ name: "auth", description: "Auth endpoints" },
			{ name: "users", description: "Users endpoints" },
			{ name: "sessions", description: "Sessions endpoints" },
			{ name: "tasks", description: "Tasks endpoints" },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "apiKey",
					name: "Authorization",
					in: "header",
					description:
						"Enter your bearer token in the format **Bearer &lt;token>**",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

env.ENVIRONMENT === "development" &&
	app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
	});

routes(app);

cron.schedule("0 0 * * *", dailyDataUpdate);

export default app;
