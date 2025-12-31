import { format, subDays } from 'date-fns'
import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../drizzle'
import { dailyProgress } from '../drizzle/schemas/daily-progress-schema'
import { users } from '../drizzle/schemas/user-schema'
import { getDatasProgress } from '../functions/daily-progress/get-datas-progress'
import { findUserById } from '../functions/user/get-user'
import { dateNow } from '../helpers/getDate'

export const verifyStreak = async (
	request: FastifyRequest,
	reply: FastifyReply,
	done: () => void
) => {
	const { id } = request.user
	const user = await findUserById(id)

	const { result } = await getDatasProgress(
		user.id, { previousDaysCount: 2 }
	)

	console.log("Datas progress: ", result)

	const yesterday = format(subDays(dateNow, 1), "yyyy-MM-dd")
	const lastDayDailyProgress = Object.values(result).filter(progress => {
		return progress.date === yesterday
	})

	if (
		lastDayDailyProgress[0]?.isGoalComplete === false
	) {
		console.log("Last daily: ", lastDayDailyProgress[0])

		await db
			.update(dailyProgress)
			.set({ streak: 0 })
			.where(eq(dailyProgress.id, lastDayDailyProgress[0]?.id))

		await db
			.update(users)
			.set({ streak: 0 })
			.where(eq(users.id, id))
	}

	done()
}
