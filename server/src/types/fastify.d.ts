import 'fastify'

export type UserPayload = {
  id: string
  email: string
  name: string
  dailySessionTarget: number
  focusSessionDuration: number
  shortBreakSessionDuration: number
  longBreakSessionDuration: number
  streak: number
  longestStreak: number
}

declare module 'fastify' {
  interface FastifyRequest {
    user: UserPayload
  }
}
