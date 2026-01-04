import { format, getDay, subDays } from "date-fns";
import { and, desc, eq, gte } from "drizzle-orm";
import { db } from "../../drizzle";
import { dailyProgress } from "../../drizzle/schemas/daily-progress-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { isDevelopment } from "../../utils/chose-environment";
import { findUserById } from "./get-user";

interface CalculateStreakResult {
	currentStreak: number;
	longestStreak: number;
}

/**
 * Calcula o streak (dias consecutivos) do usuário baseado nos dias selecionados
 * 
 * Regras:
 * - Conta apenas dias onde selectedDaysOfWeek inclui o dia da semana
 * - Um dia conta para o streak se isGoalComplete = true
 * - O streak quebra se um dia selecionado não tem meta completa
 * - Dias não selecionados são ignorados no cálculo
 * 
 * @param userId - ID do usuário
 * @returns Objeto com currentStreak e longestStreak
 */
export const calculateStreak = async (
	userId: string
): Promise<CalculateStreakResult> => {
	try {
		const user = await findUserById(userId);

		// Se não há dias selecionados, streak é 0
		if (!user.selectedDaysOfWeek || user.selectedDaysOfWeek.length === 0) {
			return {
				currentStreak: 0,
				longestStreak: user.longestStreak,
			};
		}

		// Buscar progresso dos últimos 90 dias (suficiente para calcular streak)
		const ninetyDaysAgo = format(subDays(dateNow, 90), "yyyy-MM-dd");
		const progressData = await db
			.select()
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					gte(dailyProgress.date, ninetyDaysAgo)
				)
			)
			.orderBy(desc(dailyProgress.date));

		// Criar mapa de data -> progresso para acesso rápido
		const progressMap = new Map(
			progressData.map(p => [p.date, p])
		);

		let currentStreak = 0;
		let tempStreak = 0;
		let longestStreak = user.longestStreak;

		// Começar de hoje e ir para trás
		let checkDate = new Date(dateNow);
		let foundGap = false;

		// Iterar pelos últimos 90 dias
		for (let i = 0; i < 90; i++) {
			const dateStr = format(checkDate, "yyyy-MM-dd");
			const dayOfWeek = getDay(checkDate); // 0 = Domingo, 1 = Segunda, etc.

			// Verificar se este dia da semana está nos dias selecionados
			const isDaySelected = user.selectedDaysOfWeek.includes(dayOfWeek);

			if (isDaySelected) {
				const progress = progressMap.get(dateStr);

				if (progress && progress.isGoalComplete) {
					// Meta completa neste dia
					tempStreak++;

					if (!foundGap) {
						currentStreak++;
					}

					// Atualizar longest streak se necessário
					if (tempStreak > longestStreak) {
						longestStreak = tempStreak;
					}
				} else {
					// Meta não completa ou dia sem progresso
					// Se ainda estamos no streak atual, ele acabou
					if (!foundGap) {
						foundGap = true;
					}
					// Resetar contador temporário
					tempStreak = 0;
				}
			}
			// Se o dia não está selecionado, apenas pular

			checkDate = subDays(checkDate, 1);
		}

		isDevelopment() && console.log("Streak calculado:", {
			userId: user.id,
			currentStreak,
			longestStreak,
			selectedDays: user.selectedDaysOfWeek,
		});

		return {
			currentStreak,
			longestStreak,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		isDevelopment() && console.error("Erro ao calcular streak:", error);
		throw new CustomError("Erro ao calcular streak", 500);
	}
};
