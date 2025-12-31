import { format, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { dailyProgress } from "../../drizzle/schemas/daily-progress-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { isDevelopment } from "../../utils/chose-environment";
import { createDailyProgress } from "./create-daily-progress";

interface UpdatedDailyProgressResponse {
	dailyProgress: {
		id: string;
		userId: string;
		date: string;
		isGoalComplete: boolean;
		sessionsCompleted: number;
		totalSessionFocusDuration: number;
		streak: number;
	};
}

interface UpdateDailyProgressProps {
	userId: string;
	isGoalComplete?: boolean;
	sessionsCompleted?: number;
	totalSessionFocusDuration?: number;
}

export const updateDailyProgress = async ({
	userId,
	isGoalComplete,
	sessionsCompleted,
	totalSessionFocusDuration,
}: UpdateDailyProgressProps): Promise<UpdatedDailyProgressResponse> => {
	try {
		const yesterday = format(subDays(dateNow, 1), "yyyy-MM-dd");

		const lastDailyProgress = await db
			.select({
				id: dailyProgress.id,
				streak: dailyProgress.streak,
				isGoalComplete: dailyProgress.isGoalComplete,
			})
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, yesterday),
				),
			);

		const alreadyDailyProgress = await db
			.select()
			.from(dailyProgress)
			.where(
				and(
					eq(dailyProgress.userId, userId),
					eq(dailyProgress.date, dateNow.toUTCString()),
				),
			);

		const isLastDayGoalCompleted = lastDailyProgress?.[0]?.isGoalComplete || false;

		let lastStreak = lastDailyProgress?.[0]?.streak ?? 0;

		if (isLastDayGoalCompleted) {
			const lastDailyProgressUpdate = await db
				.update(dailyProgress)
				.set({
					streak: 0,
				})
				.where(
					eq(dailyProgress.id, lastDailyProgress[0].id),
				);

			lastStreak = 0;
		}

		if (alreadyDailyProgress.length > 0) {
			const dailyProgressUpdated = await db
				.update(dailyProgress)
				.set({
					isGoalComplete,
					sessionsCompleted,
					totalSessionFocusDuration,
					streak: isGoalComplete ? lastStreak + 1 : lastStreak,
					updated_at: dateNow,
				})
				.where(
					and(
						eq(dailyProgress.userId, userId),
						eq(dailyProgress.date, dateNow.toUTCString()),
					),
				)
				.returning();

			return {
				dailyProgress: dailyProgressUpdated[0],
			};
		}

		const { dailyProgress: dailyProgressCreated } =
			await createDailyProgress(userId);

		return {
			dailyProgress: dailyProgressCreated,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		isDevelopment() && console.error("Erro ao atualizar o progresso diário", error);
		throw new CustomError("Erro ao atualizar o progresso diário", 500);
	}
};
