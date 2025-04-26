import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteTask } from '../../functions/tasks/delete-task'
import { verifyToken } from '../../middlewares/verifyToken'

export const deleteTaskRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/task/:taskId',
    {
      schema: {
        summary: 'Delete a task with taskId',
        tags: ['tasks'],
        params: z.object({
          taskId: z.string().uuid(),
        }),
        response: {},
        security: [{ bearerAuth: [] }],
      },
      preHandler: verifyToken,
    },
    async (req, reply) => {
      const { taskId } = req.params

      await deleteTask(taskId)

      reply.code(204)
    }
  )
}
