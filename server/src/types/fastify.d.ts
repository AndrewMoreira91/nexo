import 'fastify'

export type UserPayload = {
	id: string
	email: string
	name: string
	dailySessionTarget: number
	sessionDuration: number
}

declare module 'fastify' {
	interface FastifyRequest {
		user: UserPayload
	}
}
