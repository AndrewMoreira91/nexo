import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schemas/user-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { calculateStreak } from "../user/calculate-streak";

/**
 * Atualiza os dados diários de todos os usuários
 * Esta função deve ser executada uma vez por dia (ex: via cron job)
 * 
 * Recalcula o streak de todos os usuários baseado no histórico
 */
export const dailyDataUpdate = async () => {
	try {
		const usersData = await db
			.select({
				id: users.id,
				name: users.name,
			})
			.from(users);

		for (const user of usersData) {
			// Recalcular o streak para cada usuário
			const { currentStreak, longestStreak } = await calculateStreak(user.id);

			// Atualizar o usuário com os novos valores
			await db
				.update(users)
				.set({
					streak: currentStreak,
					longestStreak: longestStreak,
					updated_at: dateNow,
				})
				.where(eq(users.id, user.id));
		}

		console.log(`Daily data update completed for ${usersData.length} users`);
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError(
			"Erro ao atualizar os dados diários dos usuários",
			500,
		);
	}
};
