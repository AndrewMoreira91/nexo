import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { createDailyProgress } from '../daily-progress/create-daily-progress'

export const getTasks = async (userId: string) => {
  const { dailyProgress } = await createDailyProgress(userId)

  const tasksResponse = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.dailyProgressId, dailyProgress.id),
        isNull(tasks.deleted_at)
      )
    )

  return {
    tasks: tasksResponse,
  }
}
