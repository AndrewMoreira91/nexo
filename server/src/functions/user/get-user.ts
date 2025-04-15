import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { users } from '../../drizzle/schemas/user-schema'

export const getUser = async (userId: string) => {
	try {
		const user = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				dailySessionTarget: users.dailySessionTarget,
				focusSessionDuration: users.focusSessionDuration,
				shortBreakSessionDuration: users.shortBreakSessionDuration,
				longBreakSessionDuration: users.longBreakSessionDuration,
				streak: users.streak,
				longestStreak: users.longestStreak,
			})
			.from(users)
			.where(eq(users.id, userId))

		return user[0] || null
	} catch (error) {
		console.error(error)
	}
}
