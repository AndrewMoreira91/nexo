import { format } from "date-fns";
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
			const dailyProgressUpdated = await db
				.update(dailyProgress)
				.set({
					isGoalComplete,
					sessionsCompleted,
					totalSessionFocusDuration,
					updated_at: dateNow,
				})
				.where(
					and(
						eq(dailyProgress.userId, userId),
						eq(dailyProgress.date, today),
					),
				)
				.returning();

			return {
				dailyProgress: dailyProgressUpdated[0],
			};
		}

		const { dailyProgress: dailyProgressCreated } =
			await createDailyProgress(userId);

		// Atualizar com os valores corretos após criação
		const dailyProgressUpdated = await db
			.update(dailyProgress)
			.set({
				isGoalComplete,
				sessionsCompleted,
				totalSessionFocusDuration,
				updated_at: dateNow,
			})
			.where(eq(dailyProgress.id, dailyProgressCreated.id))
			.returning();

		return {
			dailyProgress: dailyProgressUpdated[0],
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		isDevelopment() && console.error("Erro ao atualizar o progresso diário", error);
		throw new CustomError("Erro ao atualizar o progresso diário", 500);
	}
};
