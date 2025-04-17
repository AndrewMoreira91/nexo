import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'

export const deleteTask = async (taskId: string) => {
	try {
		const task = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, taskId))
			.limit(1)

		if (!task) {
			throw new Error('Task not found')
		}

		await db.delete(tasks).where(eq(tasks.id, taskId))
	} catch (error) {
		console.error('Error deleting task:', error)
		throw new Error('Failed to delete task')
	}
}
