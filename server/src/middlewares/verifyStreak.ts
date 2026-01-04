import type { FastifyReply, FastifyRequest } from 'fastify'
import { calculateStreak } from '../functions/user/calculate-streak'
import { updateUser } from '../functions/user/update-user'

/**
 * Middleware para garantir que o streak do usuário está atualizado
 * Recalcula o streak baseado no histórico de progresso diário
 */
export const verifyStreak = async (
	request: FastifyRequest,
	reply: FastifyReply,
	done: () => void
) => {
	const { id } = request.user

	try {
		// Recalcular o streak atual
		const { currentStreak, longestStreak } = await calculateStreak(id)

		// Atualizar o usuário se necessário
		await updateUser({
			userId: id,
			streak: currentStreak,
			longestStreak
		})
	} catch (error) {
		// Log do erro mas não bloqueia a requisição
		console.error('Error verifying streak:', error)
	}

	done()
}
