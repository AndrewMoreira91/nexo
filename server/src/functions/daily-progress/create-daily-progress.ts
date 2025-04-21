import { setDate } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { dateToday } from '../../helpers/getDate'

export const createDailyProgress = async (userId: string) => {
	const alreadyDailyProgress = await db
		.select()
		.from(dailyProgress)
		.where(
			and(
				eq(dailyProgress.userId, userId),
				eq(dailyProgress.date, dateToday.toUTCString()),
			),
		)

	if (alreadyDailyProgress.length > 0) {
		return {
			dailyProgress: alreadyDailyProgress[0],
		}
	}

	const lastDay = setDate(dateToday, dateToday.getDate() - 1).toUTCString()

	const lastDailyProgress = await db
		.select({ streak: dailyProgress.streak })
		.from(dailyProgress)
		.where(
			and(eq(dailyProgress.userId, userId), eq(dailyProgress.date, lastDay)),
		)

	const dailyProgressData = await db
		.insert(dailyProgress)
		.values({
			userId,
			date: dateToday.toUTCString(),
			streak: lastDailyProgress.length > 0 ? lastDailyProgress[0].streak : 0,
		})
		.returning()

	return {
		dailyProgress: dailyProgressData[0],
	}
}
