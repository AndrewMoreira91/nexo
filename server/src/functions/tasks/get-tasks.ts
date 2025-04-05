import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'

export const getTasks = async (userId: string) => {
	const tasksResponse = await db
		.select()
		.from(tasks)
		.where(eq(tasks.userId, userId))

	return {
		tasks: tasksResponse,
	}
}
