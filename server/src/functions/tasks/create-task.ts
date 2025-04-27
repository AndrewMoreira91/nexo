import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { createDailyProgress } from "../daily-progress/create-daily-progress";

interface CreateTaskProps {
	title: string;
	userId: string;
}

export const createTask = async ({ title, userId }: CreateTaskProps) => {
	try {
		const { dailyProgress } = await createDailyProgress(userId);

		const task = await db
			.insert(tasks)
			.values({
				title,
				userId,
				dailyProgressId: dailyProgress.id,
			})
			.returning();

		return {
			task: task[0],
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao criar tarefa", 500);
	}
};
