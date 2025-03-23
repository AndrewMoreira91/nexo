import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { getUser } from '../user/get-user'

interface CreateTaskProps {
	title: string
	userId: string
}

export const createTask = async ({ title, userId }: CreateTaskProps) => {
	const user = await getUser(userId)
	if (!user) throw new Error('User not found')

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
}
