import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getStatisticDatas } from "../../functions/statistic-datas/get-statistic-datas";
import { verifyToken } from "../../middlewares/verifyToken";

export const getDataStatisticRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/get-data-statistic",
		{
			schema: {
				summary: "Get data statistic",
				tags: ["datas"],
				security: [
					{
						bearerAuth: [],
					},
				],
				querystring: z.object({
					previousDaysCount: z.string().optional(),
				}),
				response: {
					201: z.object({
						totalSessionFocusDuration: z.number(),
						sessionsFocusCompleted: z.number(),
						numTasksCompleted: z.number(),
						streak: z.number(),
						longestStreak: z.number(),
						tasksCompleted: z.array(
							z.object({
								id: z.string(),
								title: z.string(),
								dailyProgressId: z.string().nullable(),
								isCompleted: z.boolean(),
								created_at: z.date(),
								updated_at: z.date().nullable(),
								deleted_at: z.date().nullable(),
							}),
						),
						dailyMediaDuration: z.number(),
						weeklyTrend: z.number().optional(),
						bestDay: z.object({
							date: z.string(),
							timeCompleted: z.number(),
							isTargetCompleted: z.boolean(),
						}),
						worstDay: z.object({
							date: z.string(),
							timeCompleted: z.number(),
							isTargetCompleted: z.boolean(),
						}),
					}),
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

			const { result } = await getStatisticDatas(userId, query);

			reply.status(200).send(result);
		},
	);
};
