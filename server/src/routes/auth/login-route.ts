import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { login } from "../../functions/auth/login";
import { UserSchema } from "../../zod/schemas";

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/login",
		{
			schema: {
				summary: "Login in the application",
				description: "Login in the application and get a token",
				tags: ["auth"],
				body: z.object({
					email: z.string().email("Email inválido"),
					password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
				}),
				response: {
					200: z.object({
						user: UserSchema,
						accessToken: z.string(),
					}),
					500: z.object({
						statusCode: z.number(),
						error: z.string(),
						message: z.string(),
					}),
				},
			},
		},
		async (req, reply) => {
			const { email, password } = req.body;

			const { user, accessToken } = await login({ email, password });

			return { accessToken, user };
		},
	);
};
