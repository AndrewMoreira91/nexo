import { relations } from 'drizzle-orm'
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { dailyProgress } from './daily-progress-schema'
import { sessions } from './session-schema'
import { tasks } from './tasks-schema'

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	dailySessionTarget: integer('daily_session_target').notNull().default(0),
	sessionDuration: integer('sessions_duration').notNull().default(0),
	streak: integer('streak').notNull().default(0),
	longestStreak: integer('longest_streak').notNull().default(0),
})

export const userRelations = relations(users, ({ many }) => ({
	task: many(tasks),
	sessions: many(sessions),
	dailyProgress: many(dailyProgress),
}))
