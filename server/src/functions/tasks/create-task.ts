import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'

interface CreateTaskProps {
	title: string
	userId: string
}

export const createTask = async ({ title, userId }: CreateTaskProps) => {
	try {
		const task = await db
			.insert(tasks)
			.values({
				title,
				userId,
			})
			.returning()

		return {
			task: task[0],
		}
	} catch (error) {
		console.error(error)
		throw new Error('Failed to create task')
	}
}
