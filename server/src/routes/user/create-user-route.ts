import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createUser } from "../../functions/user/create-user";
import { UserSchema } from "../../zod/schemas";
import {
	emailValidation,
	nameValidation,
	passwordValidation,
} from "../../zod/validations";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/user",
		{
			schema: {
				summary: "Create a new user",
				tags: ["users"],
				body: z.object({
					name: nameValidation,
					email: emailValidation,
					password: passwordValidation,
				}),
				response: {
					201: z.object({
						user: UserSchema,
						accessToken: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;
			const { user, accessToken } = await createUser({ email, name, password });

			reply.code(201).send({ user, accessToken });
		},
	);
};
