import { relations } from 'drizzle-orm'
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers'
import { dailyProgress } from './daily-progress-schema'
import { sessions } from './session-schema'
import { tasks } from './tasks-schema'

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	dailySessionTarget: integer('daily_session_target').notNull().default(2),
	focusSessionDuration: integer('focus_session_duration')
		.notNull()
		.default(1500),
	shortBreakSessionDuration: integer('short_break_session_duration')
		.notNull()
		.default(300),
	longBreakSessionDuration: integer('long_break_session_duration')
		.notNull()
		.default(900),
	streak: integer('streak').notNull().default(0),
	longestStreak: integer('longest_streak').notNull().default(0),
	...timestamps,
})

export const userRelations = relations(users, ({ many }) => ({
	task: many(tasks),
	sessions: many(sessions),
	dailyProgress: many(dailyProgress),
}))
