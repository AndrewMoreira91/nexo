import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env'
import { getUser } from '../functions/user/get-user'

export const verifyToken = async (
	req: FastifyRequest,
	reply: FastifyReply,
	done: () => void,
) => {
	const token = req.headers.authorization?.replace('Bearer ', '')
	if (!token) {
		return reply.code(401).send({ message: 'Unauthorized: missing token' })
	}

	const { userId } = jwt.verify(token, env.JWT_SECRET) as { userId: string }

	const user = await getUser(userId)
	if (!user) {
		return reply.code(401).send({ message: 'Unauthorized: Token invalid' })
	}

	req.user = user
}
