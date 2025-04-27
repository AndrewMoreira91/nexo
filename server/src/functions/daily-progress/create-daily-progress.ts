import { setDate } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { dailyProgress } from "../../drizzle/schemas/daily-progress-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { findUserById } from "../user/get-user";

export const createDailyProgress = async (userId: string) => {
	try {
		const user = await findUserById(userId);

		const alreadyDailyProgress = await db
			.select()
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, dateNow.toUTCString()),
				),
			);

		if (alreadyDailyProgress.length > 0) {
			return {
				dailyProgress: alreadyDailyProgress[0],
			};
		}

		const lastDay = setDate(dateNow, dateNow.getDate() - 1).toUTCString();

		const lastDailyProgress = await db
			.select({ streak: dailyProgress.streak })
			.from(dailyProgress)
			.where(
				and(eq(dailyProgress.userId, userId), eq(dailyProgress.date, lastDay)),
			);

		const dailyProgressData = await db
			.insert(dailyProgress)
			.values({
				userId,
				date: dateNow.toUTCString(),
				streak: lastDailyProgress.length > 0 ? lastDailyProgress[0].streak : 0,
			})
			.returning();

		return {
			dailyProgress: dailyProgressData[0],
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao criar progresso diário", 500);
	}
};
