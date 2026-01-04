import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { dailyProgress } from "../../drizzle/schemas/daily-progress-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { isDevelopment } from "../../utils/chose-environment";
import { findUserById } from "../user/get-user";

export const createDailyProgress = async (userId: string) => {
	try {
		const user = await findUserById(userId);
		const today = format(dateNow, "yyyy-MM-dd");

		const alreadyDailyProgress = await db
			.select()
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, today),
				),
			);

		if (alreadyDailyProgress.length > 0) {
			return {
				dailyProgress: alreadyDailyProgress[0],
			};
		}

		const dailyProgressData = await db
			.insert(dailyProgress)
			.values({
				userId,
				date: today,
			})
			.returning();

		return {
			dailyProgress: dailyProgressData[0],
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		isDevelopment() && console.error(error);
		throw new CustomError("Erro ao criar progresso diário", 500);
	}
};
