import { and, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { sessions } from '../../drizzle/schemas/session-schema'
import { dateToday } from '../../utils/getDate'
import { updateDailyProgress } from '../daily-progress/update-daily-progress'
import { getUser } from '../user/get-user'

interface EndSessionProps {
	duration: number
	sessionId: string
	userId: string
}

export const endSession = async ({
	duration,
	sessionId,
	userId,
}: EndSessionProps) => {
	try {
		const activeSession = await db
			.select()
			.from(sessions)
			.where(and(eq(sessions.id, sessionId)))
		if (activeSession.length === 0) throw new Error('Session not found')
		if (activeSession[0].endTime) throw new Error('Session already ended')

		const session = await db
			.update(sessions)
			.set({
				endTime: dateToday,
				sessionEndDate: dateToday.toUTCString(),
				duration,
			})
			.where(eq(sessions.id, sessionId))
			.returning()

		const user = await getUser(userId)
		if (!user) throw new Error('User not found')

		const userFocusSessions = await db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.userId, userId),
					eq(sessions.type, 'focus'),
					eq(sessions.sessionEndDate, dateToday.toUTCString()),
				),
			)

		const isGoalComplete = user.dailySessionTarget <= userFocusSessions.length
		const sessionsCompleted = userFocusSessions.length
		const totalSessionFocusDuration = userFocusSessions.reduce(
			(acc, session) => acc + session.duration,
			0,
		)

		const { dailyProgress } = await updateDailyProgress({
			userId,
			isGoalComplete,
			sessionsCompleted,
			totalSessionFocusDuration,
		})

		return {
			session: session[0],
			isGoalComplete: dailyProgress.isGoalComplete,
			sessionsCompleted: dailyProgress.sessionsCompleted,
			totalSessionFocusDuration: dailyProgress.totalSessionFocusDuration,
			streak: dailyProgress.streak,
		}
	} catch (error) {
		console.error(error)
		throw new Error(error instanceof Error ? error.message : String(error))
	}
}
