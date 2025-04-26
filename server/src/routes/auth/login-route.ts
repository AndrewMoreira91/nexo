import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { login } from '../../functions/auth/login'

export const loginRoute: FastifyPluginAsyncZod = async app => {
  try {
    app.post(
      '/login',
      {
        schema: {
          summary: 'Login in the application',
          description: 'Login in the application and get a token',
          tags: ['auth'],
          body: z.object({
            email: z.string().email(),
            password: z.string().min(6),
          }),
          response: {
            200: z.object({
              user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                dailySessionTarget: z.number(),
                focusSessionDuration: z.number(),
                shortBreakSessionDuration: z.number(),
                longBreakSessionDuration: z.number(),
                streak: z.number(),
                longestStreak: z.number(),
              }),
              accessToken: z.string(),
            }),
          },
        },
      },
      async request => {
        const { email, password } = request.body

        const { user, accessToken } = await login({ email, password })

        return { accessToken, user }
      }
    )
  } catch (error) {
    console.error(error)
  }
}
