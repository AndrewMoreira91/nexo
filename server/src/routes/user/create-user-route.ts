import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUser } from '../../functions/user/create-user'

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		'/user',
		{
			schema: {
				summary: 'Create a new user',
				tags: ['users'],
				body: z.object({
					name: z.string().nonempty(),
					email: z.string().email(),
					password: z.string().min(6),
				}),
				response: {
					201: z.object({
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
						acessToken: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body
			const { user, acessToken } = await createUser({ email, name, password })

			reply.code(201).send({ user, acessToken })
		},
	)
}
