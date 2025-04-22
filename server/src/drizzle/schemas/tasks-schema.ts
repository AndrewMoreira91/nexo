import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../helpers'
import { dailyProgress } from './daily-progress-schema'
import { users } from './user-schema'

export const tasks = pgTable('tasks', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull(),
	dailyProgressId: uuid('daily_progress_id').notNull(),
	title: text('title').notNull(),
	isCompleted: boolean('is_completed').notNull().default(false),
	...timestamps,
})

export const taskRelations = relations(tasks, ({ one }) => ({
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id],
	}),
	dailyProgress: one(dailyProgress, {
		fields: [tasks.dailyProgressId],
		references: [dailyProgress.id],
	}),
}))
