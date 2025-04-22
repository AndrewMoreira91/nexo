import { relations } from 'drizzle-orm'
import { boolean, date, integer, pgTable, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers'
import { sessions } from './session-schema'
import { tasks } from './tasks-schema'
import { users } from './user-schema'

export const dailyProgress = pgTable('daily_progress', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	date: date('date').notNull(),
	isGoalComplete: boolean('is_goal_complete').notNull().default(false),
	sessionsCompleted: integer('sessions_completed').notNull().default(0),
	totalSessionFocusDuration: integer('total_session_focus_duration')
		.notNull()
		.default(0),
	streak: integer('streak').notNull().default(0),
	...timestamps,
})

export const dailyProgressRelations = relations(
	dailyProgress,
	({ one, many }) => ({
		user: one(users, {
			fields: [dailyProgress.userId],
			references: [users.id],
		}),
		tasks: many(tasks),
		sessions: many(sessions),
	}),
)
