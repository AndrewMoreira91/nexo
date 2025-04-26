import { eq, sql } from 'drizzle-orm'
import { db } from '../../drizzle'
import { dailyProgress } from '../../drizzle/schemas/daily-progress-schema'
import { users } from '../../drizzle/schemas/user-schema'
import { dateNow } from '../../helpers/getDate'

import { format } from 'date-fns'

export const dailyDataUpdate = async () => {
  const formattedDateToday = format(dateNow, 'yyyy-MM-dd')

  const usersData = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)

  for (const user of usersData) {
    const lastDailyProgress = await db
      .select()
      .from(dailyProgress)
      .where(eq(dailyProgress.userId, user.id))
      .limit(1)
      .orderBy(sql`date DESC`)

    if (
      lastDailyProgress.length === 0 ||
      lastDailyProgress[0].date !== formattedDateToday
    ) {
      await db
        .update(users)
        .set({
          streak: 0,
          updated_at: dateNow,
        })
        .where(eq(users.id, user.id))

      return
    }

    if (lastDailyProgress[0].isGoalComplete) {
      await db
        .update(users)
        .set({
          streak: sql`streak + 1`,
          longestStreak: sql`GREATEST(longest_streak, streak + 1)`,
          updated_at: dateNow,
        })
        .where(eq(users.id, user.id))
    }
  }
}
