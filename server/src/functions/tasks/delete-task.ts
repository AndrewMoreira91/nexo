import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";

export const deleteTask = async (taskId: string) => {
	try {
		const task = await db
			.select()
			.from(tasks)
			.where(eq(tasks.id, taskId))
			.limit(1);

		if (!task) {
			throw new CustomError("Tarefa não encontrada", 404);
		}

		await db
			.update(tasks)
			.set({
				updated_at: dateNow,
				deleted_at: dateNow,
			})
			.where(eq(tasks.id, taskId));
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao deletar tarefa", 500);
	}
};
