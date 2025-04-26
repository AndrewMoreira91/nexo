import { and, eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { sessions } from '../../drizzle/schemas/session-schema'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { users } from '../../drizzle/schemas/user-schema'
import { dateNow } from '../../helpers/getDate'
import { updateDailyProgress } from '../daily-progress/update-daily-progress'
import { getUser } from '../user/get-user'

interface EndSessionProps {
  duration: number
  sessionId: string
  userId: string
  completedTasksIds?: string[]
}

export const endSession = async ({
  duration,
  sessionId,
  userId,
  completedTasksIds,
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
        endTime: dateNow,
        sessionEndDate: dateNow.toUTCString(),
        duration,
        updated_at: dateNow,
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
          eq(sessions.sessionEndDate, dateNow.toUTCString())
        )
      )

    const sessionsCompleted = userFocusSessions.length
    const isGoalComplete = user.dailySessionTarget <= sessionsCompleted
    const totalSessionFocusDuration = userFocusSessions.reduce(
      (acc, session) => acc + session.duration,
      0
    )

    const { dailyProgress } = await updateDailyProgress({
      userId,
      isGoalComplete,
      sessionsCompleted,
      totalSessionFocusDuration,
    })

    for (const taskId of completedTasksIds || []) {
      await db
        .update(tasks)
        .set({
          dailyProgressId: dailyProgress.id,
          isCompleted: true,
        })
        .where(eq(tasks.id, taskId))
    }

    await db
      .update(users)
      .set({
        streak: dailyProgress.streak,
      })
      .where(eq(users.id, userId))

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
