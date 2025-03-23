import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { string, z } from 'zod'
import { createSession } from '../../functions/sessions/create-session'
import { verifyToken } from '../../middlewares/verifyToken'

export const createSessionRoute: FastifyPluginAsyncZod = async (app) => {
	try {
		app.post(
			'/start-session',
			{
				schema: {
					summary: 'Create a new session',
					tags: ['sessions'],
					body: z.object({
						type: z.enum(['focus', 'shortBreak', 'longBreak']),
					}),
					security: [{ bearerAuth: [] }],
					response: {
						201: z.object({
							id: z.string(),
							userId: z.string(),
							dailyProgressId: z.string(),
							duration: z.number(),
							type: z.string(),
							startTime: z.date(),
							endTime: z.date().nullable(),
							sessionEndDate: string().nullable(),
						}),
						401: z.object({
							message: z.string(),
						}),
					},
				},
				preHandler: verifyToken,
			},
			async (req, reply) => {
				const { type } = req.body
				const { id: userId } = req.user

				const { session } = await createSession({ type, userId })

				reply.code(201).send(session)
			},
		)
	} catch (error) {
		console.error(error)
	}
}
