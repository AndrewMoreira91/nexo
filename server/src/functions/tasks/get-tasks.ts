import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { createDailyProgress } from "../daily-progress/create-daily-progress";
import { findUserById } from "../user/get-user";

export const getTasks = async (userId: string) => {
	try {
		const user = await findUserById(userId);

		const { dailyProgress } = await createDailyProgress(userId);

		const tasksResponse = await db
			.select()
			.from(tasks)
			.where(
				and(
					eq(tasks.userId, userId),
					eq(tasks.dailyProgressId, dailyProgress.id),
					isNull(tasks.deleted_at),
				),
			);

		return {
			tasks: tasksResponse,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao buscar tarefas", 500);
	}
};
