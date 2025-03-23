import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { createDailyProgress } from '../daily-progress/create-daily-progress'

interface UpdateTaskInput {
	id: string
	userId: string
	title?: string
	isCompleted?: boolean
}

interface DailyProgressType {
	id: string
	userId: string
	date: string
	isGoalComplete: boolean
	sessionsCompleted: number
	totalSessionFocusDuration: number
	streak: number
}

export const updateTask = async ({
	id,
	isCompleted,
	title,
	userId,
}: UpdateTaskInput) => {
	let dailyProgress: DailyProgressType | null = null

	if (isCompleted) {
		const { dailyProgress: dp } = await createDailyProgress(userId)
		dailyProgress = dp
	}

	const task = await db
		.update(tasks)
		.set({
			title,
			isCompleted,
			dailyProgressId: dailyProgress ? dailyProgress.id : undefined,
		})
		.where(eq(tasks.id, id))
		.returning()

	return { task: task[0] }
}
