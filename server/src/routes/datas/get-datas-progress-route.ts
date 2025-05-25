import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getDatasProgress } from "../../functions/daily-progress/get-datas-progress";
import { verifyToken } from "../../middlewares/verifyToken";

export const getDataProgressRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/get-data-progress",
		{
			schema: {
				summary: "Get all progress data",
				tags: ["datas"],
				security: [{ bearerAuth: [] }],
				querystring: z.object({
					previousDaysCount: z.string().optional(),
				}),
				response: {
					201: z.array(
						z.object({
							date: z.string(),
							isGoalComplete: z.boolean(),
							sessionsCompleted: z.number(),
							totalSessionFocusDuration: z.number(),
							streak: z.number(),
						}),
					),
				},
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { id: userId } = req.user;
			const { previousDaysCount } = req.query;

			const query = {
				previousDaysCount: previousDaysCount ? Number(previousDaysCount) : 0,
			};

			const { result } = await getDatasProgress(userId, query);

			reply.status(200).send(result);
		},
	);
};
