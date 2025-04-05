import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../../drizzle'
import { users } from '../../drizzle/schemas/user-schema'
import { createToken } from '../../utils/createToken'

interface LoginProps {
	email: string
	password: string
}

export const login = async ({ email, password }: LoginProps) => {
	try {
		const user = await db.select().from(users).where(eq(users.email, email))
		if (!user[0]) throw new Error('Invalid email or password')

		const isPasswordValid = await bcrypt.compare(password, user[0].password)
		if (!isPasswordValid) throw new Error('Invalid email or password')

		const token = createToken(user[0].id)

		return {
			user: {
				id: user[0].id,
				email: user[0].email,
				name: user[0].name,
				dailySessionTarget: user[0].dailySessionTarget,
				streak: user[0].streak,
				longestStreak: user[0].longestStreak,
			},
			token,
		}
	} catch (error) {
		console.error(error)
		throw error
	}
}
