import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { updateTask } from '../../functions/tasks/update-task'
import { verifyToken } from '../../middlewares/verifyToken'

export const updateTaskRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		'/task',
		{
			schema: {
				summary: 'Update a task',
				tags: ['tasks'],
				body: z.object({
					id: z.string().nonempty(),
					title: z.string().optional(),
					isCompleted: z.boolean().optional(),
				}),
				response: {
					201: z.object({
						id: z.string(),
						dailyProgressId: z.string().nullable(),
						title: z.string(),
						isCompleted: z.boolean(),
						userId: z.string(),
					}),
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { title, id, isCompleted } = req.body
			const { id: userId } = req.user

			const { task } = await updateTask({ id, title, isCompleted, userId })

			reply.code(201).send(task)
		},
	)
}
