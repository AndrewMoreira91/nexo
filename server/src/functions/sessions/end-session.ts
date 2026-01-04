import { format } from "date-fns";
import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { sessions } from "../../drizzle/schemas/session-schema";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { updateDailyProgress } from "../daily-progress/update-daily-progress";
import { calculateStreak } from "../user/calculate-streak";
import { findUserById } from "../user/get-user";
import { updateUser } from "../user/update-user";

interface EndSessionProps {
	sessionId: string;
	userId: string;
	completedTasksIds?: string[];
}

export const endSession = async ({
	sessionId,
	userId,
	completedTasksIds,
}: EndSessionProps) => {
	try {
		const activeSession = await db
			.select()
			.from(sessions)
			.where(and(eq(sessions.id, sessionId)));

		if (activeSession.length === 0)
			throw new CustomError("Sessão não encontrada", 404);
		if (activeSession[0].endTime)
			throw new CustomError("Sessão já encerrada", 400);

		const today = format(dateNow, "yyyy-MM-dd");

		const session = await db
			.update(sessions)
			.set({
				endTime: dateNow,
				sessionEndDate: today,
				updated_at: dateNow,
			})
			.where(eq(sessions.id, sessionId))
			.returning();

		const user = await findUserById(userId);

		const userFocusSessions = await db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.userId, userId),
					eq(sessions.type, "focus"),
					eq(sessions.sessionEndDate, today),
				),
			);

		const sessionsCompleted = userFocusSessions.length;
		const isGoalComplete = user.dailySessionTarget <= sessionsCompleted;

		const totalSessionFocusDuration = userFocusSessions.reduce(
			(acc, session) => acc + session.duration,
			0,
		);

		const { dailyProgress } = await updateDailyProgress({
			userId,
			isGoalComplete,
			sessionsCompleted,
			totalSessionFocusDuration,
		});

		for (const taskId of completedTasksIds || []) {
			await db
				.update(tasks)
				.set({
					dailyProgressId: dailyProgress.id,
					isCompleted: true,
				})
				.where(eq(tasks.id, taskId));
		}

		// Calcular o streak após atualizar o progresso diário
		const { currentStreak, longestStreak } = await calculateStreak(userId);

		// Atualizar o usuário com o novo streak
		await updateUser({ userId, streak: currentStreak, longestStreak });

		return {
			session: session[0],
			isGoalComplete: dailyProgress.isGoalComplete,
			sessionsCompleted: dailyProgress.sessionsCompleted,
			totalSessionFocusDuration: dailyProgress.totalSessionFocusDuration,
			streak: currentStreak,
		};
	} catch (error) {
		console.error("Error in endSession:", error);
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao encerrar sessão", 500);
	}
};
