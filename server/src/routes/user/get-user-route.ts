import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { findUserById } from "../../functions/user/get-user";
import { verifyToken } from "../../middlewares/verifyToken";
import { UserSchema } from "../../zod/schemas";

export const getUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/user",
		{
			schema: {
				summary: "Get user details",
				tags: ["users"],
				response: {
					201: UserSchema,
				},
			},
			preHandler: verifyToken
		},
		async (request, reply) => {
			const {id} = request.user;

			const user = await findUserById(id);

			reply.code(201).send(user);
		},
	);
};
