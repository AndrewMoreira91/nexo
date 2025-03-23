import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getDatasProgress } from '../../functions/daily-progress/get-datas-progress'
import { verifyToken } from '../../middlewares/verifyToken'

export const getDataProgressRoute: FastifyPluginAsyncZod = async (app) => {
	try {
		app.get(
			'/get-data-progress',
			{
				schema: {
					summary: 'Get all progress data',
					tags: ['datas'],
					security: [
						{
							bearerAuth: [],
						},
					],
					response: {
						201: z.object({
							result: z.array(
								z.object({
									date: z.string(),
									isGoalComplete: z.boolean(),
									sessionsCompleted: z.number(),
									totalSessionFocusDuration: z.number(),
									streak: z.number(),
								}),
							),
						}),
						401: z.object({
							message: z.string(),
						}),
					},
				},
				preHandler: verifyToken,
			},
			async (req, reply) => {
				const { id: userId } = req.user

				const { result } = await getDatasProgress(userId)

				reply.status(200).send({ result })
			},
		)
	} catch (error) {
		console.error(error)
	}
}
