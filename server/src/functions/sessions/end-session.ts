import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { sessions } from "../../drizzle/schemas/session-schema";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";
import { updateDailyProgress } from "../daily-progress/update-daily-progress";
import { findUserById } from "../user/get-user";
import { updateUser } from "../user/update-user";

interface EndSessionProps {
	duration: number;
	sessionId: string;
	userId: string;
	completedTasksIds?: string[];
}

export const endSession = async ({
	duration,
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

		const session = await db
			.update(sessions)
			.set({
				endTime: dateNow,
				sessionEndDate: dateNow.toUTCString(),
				duration,
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
					eq(sessions.sessionEndDate, dateNow.toUTCString()),
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

		const longestStreak =
			dailyProgress.streak > user.longestStreak
				? dailyProgress.streak
				: user.longestStreak;

		await updateUser({ userId, streak: dailyProgress.streak, longestStreak });

		return {
			session: session[0],
			isGoalComplete: dailyProgress.isGoalComplete,
			sessionsCompleted: dailyProgress.sessionsCompleted,
			totalSessionFocusDuration: dailyProgress.totalSessionFocusDuration,
			streak: dailyProgress.streak,
		};
	} catch (error) {
		console.error("Error in endSession:", error);
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao encerrar sessão", 500);
	}
};
