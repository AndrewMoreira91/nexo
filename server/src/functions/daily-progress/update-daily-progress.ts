import { format, subDays } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { dateNow } from '../../helpers/getDate'
import { createDailyProgress } from './create-daily-progress'

interface UpdatedDailyProgressResponse {
	dailyProgress: {
		id: string
		userId: string
		date: string
		isGoalComplete: boolean
		sessionsCompleted: number
		totalSessionFocusDuration: number
		streak: number
	}
}

interface UpdateDailyProgressProps {
	userId: string
	isGoalComplete?: boolean
	sessionsCompleted?: number
	totalSessionFocusDuration?: number
}

export const updateDailyProgress = async ({
	userId,
	isGoalComplete,
	sessionsCompleted,
	totalSessionFocusDuration,
}: UpdateDailyProgressProps): Promise<UpdatedDailyProgressResponse> => {
	const yesterday = format(subDays(dateNow, 1), 'yyyy-MM-dd')

	const lastDailyProgress = await db
		.select({ streak: dailyProgress.streak })
		.from(dailyProgress)
		.where(
			and(eq(dailyProgress.userId, userId), eq(dailyProgress.date, yesterday)),
		)

	const alreadyDailyProgress = await db
		.select()
		.from(dailyProgress)
		.where(
			and(
				eq(dailyProgress.userId, userId),
				eq(dailyProgress.date, dateNow.toUTCString()),
			),
		)

	const lastStreak = lastDailyProgress?.[0]?.streak ?? 0

	if (alreadyDailyProgress.length > 0) {
		const dailyProgressUpdated = await db
			.update(dailyProgress)
			.set({
				isGoalComplete,
				sessionsCompleted,
				totalSessionFocusDuration,
				streak: isGoalComplete ? lastStreak + 1 : lastStreak,
				updated_at: dateNow,
			})
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, dateNow.toUTCString()),
				),
			)
			.returning()

		return {
			dailyProgress: dailyProgressUpdated[0],
		}
	}

	const { dailyProgress: dailyProgressCreated } =
		await createDailyProgress(userId)

	return {
		dailyProgress: dailyProgressCreated,
	}
}
