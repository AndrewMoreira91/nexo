import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { endSession } from '../../functions/sessions/end-session'
import { verifyToken } from '../../middlewares/verifyToken'

export const endSessionRoute: FastifyPluginAsyncZod = async app => {
  try {
    app.put(
      '/end-session',
      {
        schema: {
          summary: 'End a session',
          tags: ['sessions'],
          body: z.object({
            duration: z.number(),
            sessionId: z.string(),
            completedTasksIds: z.array(z.string()).optional(),
          }),
          security: [
            {
              bearerAuth: [],
            },
          ],
          response: {
            201: z.object({
              session: z.object({
                id: z.string(),
                duration: z.number(),
                type: z.string(),
                startTime: z.date(),
                endTime: z.date().nullable(),
                userId: z.string(),
                sessionEndDate: z.string().nullable(),
              }),
              isGoalComplete: z.boolean(),
              sessionsCompleted: z.number(),
              totalSessionFocusDuration: z.number(),
              streak: z.number(),
            }),
            401: z.object({
              message: z.string(),
            }),
          },
        },
        preHandler: verifyToken,
      },
      async (req, reply) => {
        const { duration, sessionId, completedTasksIds } = req.body
        const { id: userId } = req.user
        const {
          session,
          isGoalComplete,
          sessionsCompleted,
          totalSessionFocusDuration,
          streak,
        } = await endSession({ duration, sessionId, userId, completedTasksIds })

        reply.code(201).send({
          session,
          isGoalComplete,
          sessionsCompleted,
          totalSessionFocusDuration,
          streak,
        })
      }
    )
  } catch (error) {
    console.error(error)
  }
}
