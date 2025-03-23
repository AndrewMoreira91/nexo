import { and, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { dateToday } from '../../utils/getDate'
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
		const dailyProgressUpdated = await db
			.update(dailyProgress)
			.set({
				isGoalComplete,
				sessionsCompleted,
				totalSessionFocusDuration,
				streak: isGoalComplete
					? alreadyDailyProgress[0].streak + 1
					: alreadyDailyProgress[0].streak,
			})
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, dateToday.toUTCString()),
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
