import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers'
import { dailyProgress } from './daily-progress-schema'
import { users } from './user-schema'

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  dailyProgressId: uuid('daily_progress_id').notNull(),
  duration: integer('duration').notNull().default(0),
  type: text({ enum: ['focus', 'shortBreak', 'longBreak'] }).notNull(),
  startTime: timestamp('start_time').notNull().defaultNow(),
  endTime: timestamp('end_time'),
  sessionEndDate: date('session_end_date'),
  ...timestamps,
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
  dailyProgress: one(dailyProgress, {
    fields: [sessions.dailyProgressId],
    references: [dailyProgress.id],
  }),
}))
