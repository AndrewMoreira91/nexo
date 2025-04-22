import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../../drizzle'
import { sessions } from '../../drizzle/schemas/session-schema'
import { users } from '../../drizzle/schemas/user-schema'
import { dateNow } from '../../helpers/getDate'
import { createDailyProgress } from '../daily-progress/create-daily-progress'

interface CreateSessionProps {
	type: 'focus' | 'shortBreak' | 'longBreak'
	userId: string
}

export const createSession = async ({ type, userId }: CreateSessionProps) => {
	try {
		const user = await db.select().from(users).where(eq(users.id, userId))
		if (user.length === 0) throw new Error('User not found')

		const isSessionActive = await db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.userId, userId),
					eq(sessions.type, type),
					isNull(sessions.endTime),
					eq(sessions.startTime, dateNow),
				),
			)
		if (isSessionActive.length > 0) {
			return {
				session: isSessionActive[0],
			}
		}

		const { dailyProgress } = await createDailyProgress(userId)

		const session = await db
			.insert(sessions)
			.values({
				type,
				userId,
				dailyProgressId: dailyProgress.id,
				startTime: dateNow,
			})
			.returning()

		return {
			session: session[0],
		}
	} catch (error) {
		console.error(error)
		throw new Error(error instanceof Error ? error.message : String(error))
	}
}
