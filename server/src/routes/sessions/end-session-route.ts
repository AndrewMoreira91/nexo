import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { endSession } from "../../functions/sessions/end-session";
import { verifyToken } from "../../middlewares/verifyToken";
import { SessionSchema } from "../../zod/schemas";

export const endSessionRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/end-session",
		{
			schema: {
				summary: "End a session",
				tags: ["sessions"],
				body: z.object({
					duration: z.number().int().nonnegative(),
					sessionId: z.string().uuid(),
					completedTasksIds: z.array(z.string().uuid()).optional(),
				}),
				security: [
					{
						bearerAuth: [],
					},
				],
				response: {
					201: z.object({
						session: SessionSchema,
						isGoalComplete: z.boolean(),
						sessionsCompleted: z.number(),
						totalSessionFocusDuration: z.number(),
						streak: z.number(),
					}),
				},
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { id: userId } = req.user;
			const { duration, sessionId, completedTasksIds } = req.body;

			const {
				session,
				isGoalComplete,
				sessionsCompleted,
				totalSessionFocusDuration,
				streak,
			} = await endSession({
				duration,
				sessionId,
				userId,
				completedTasksIds,
			});

			reply.code(201).send({
				session,
				isGoalComplete,
				sessionsCompleted,
				totalSessionFocusDuration,
				streak,
			});
		},
	);
};
