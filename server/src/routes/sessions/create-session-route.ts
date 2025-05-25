import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createSession } from "../../functions/sessions/create-session";
import { verifyToken } from "../../middlewares/verifyToken";
import { SessionSchema } from "../../zod/schemas";

export const createSessionRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/start-session",
		{
			schema: {
				summary: "Create a new session",
				tags: ["sessions"],
				body: z.object({
					type: z.enum(["focus", "shortBreak", "longBreak"], {
						message: "Tipo de sessão inválido",
					}),
				}),
				security: [{ bearerAuth: [] }],
				response: {
					201: SessionSchema,
				},
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { type } = req.body;
			const { id: userId } = req.user;

			const { session } = await createSession({ type, userId });

			reply.code(201).send(session);
		},
	);
};
