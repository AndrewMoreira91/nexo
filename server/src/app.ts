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
import { env } from "./env";
import { errorHandler } from "./middlewares/errorHandler";
import { routes } from "./routes";
import { isDevelopment } from "./utils/chose-environment";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: isDevelopment() ? true : env.PRODUCTION_API_URL,
	methods: ["GET", "POST", "PUT", "DELETE"],
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Nekso API",
			version: "0.1.0",
		},
		servers: [
			{
				url: `http://localhost:${env.PORT}`,
				description: "Development server",
			},
			...(env.PRODUCTION_API_URL
				? [
					{
						url: env.PRODUCTION_API_URL,
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
			{ name: "tests", description: "Tests endpoints" },
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

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

routes(app);

export default app;
