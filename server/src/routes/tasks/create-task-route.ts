import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createTask } from '../../functions/tasks/create-task'
import { verifyToken } from '../../middlewares/verifyToken'

export const createTaskRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/task',
    {
      schema: {
        summary: 'Create a new task',
        tags: ['tasks'],
        body: z.object({
          title: z.string().nonempty(),
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
      const { title } = req.body
      const { id: userId } = req.user

      const { task } = await createTask({ title, userId })

      reply.code(201).send(task)
    }
  )
}
