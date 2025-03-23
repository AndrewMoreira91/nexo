import bcrypt from 'bcrypt'
import { db } from '../../drizzle'
import { users } from '../../drizzle/schemas/user-schema'
import { createToken } from '../../utils/createToken'

interface CreateUserProps {
	name: string
	email: string
	password: string
}

export const createUser = async ({
	name,
	email,
	password,
}: CreateUserProps) => {
	const passwordHash = await bcrypt.hash(password, 10)

	const user = await db
		.insert(users)
		.values({
			name,
			email,
			password: passwordHash,
		})
		.returning({
			id: users.id,
			name: users.name,
			email: users.email,
			dailySessionTarget: users.dailySessionTarget,
			sessionDuration: users.sessionDuration,
		})

	const token = createToken(user[0].id)

	return {
		user: user[0],
		token,
	}
}
