import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { createDailyProgress } from "../daily-progress/create-daily-progress";

interface UpdateTaskInput {
	id: string;
	userId: string;
	title?: string;
	isCompleted?: boolean;
}

interface DailyProgressType {
	id: string;
	userId: string;
	date: string;
	isGoalComplete: boolean;
	sessionsCompleted: number;
	totalSessionFocusDuration: number;
	streak: number;
}

export const updateTask = async ({
	id,
	isCompleted,
	title,
	userId,
}: UpdateTaskInput) => {
	try {
		const { dailyProgress } = await createDailyProgress(userId);

		const taskExists = await db.select().from(tasks).where(eq(tasks.id, id));
		if (taskExists.length === 0) {
			throw new CustomError("Tarefa não encontrada", 404);
		}

		const task = await db
			.update(tasks)
			.set({
				title,
				isCompleted,
				dailyProgressId: dailyProgress.id,
				updated_at: new Date(),
			})
			.where(eq(tasks.id, id))
			.returning();

		return { task: task[0] };
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao atualizar tarefa", 500);
	}
};
