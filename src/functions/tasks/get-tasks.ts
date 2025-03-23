import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { tasks } from '../../drizzle/schemas/tasks-schema'
import { getUser } from '../user/get-user'

export const getTasks = async (userId: string) => {
	const user = await getUser(userId)
	if (!user) throw new Error('User not found')

	const tasksResponse = await db.select().from(tasks).where(eq(tasks.userId, userId))

	return {
		tasks: tasksResponse
	}
}
