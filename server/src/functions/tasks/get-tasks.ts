import { subDays } from "date-fns";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";

type TaskQuery = {
	daysPrev?: number;
	isCompleted?: string;
	isDeleted?: string;
};

export const getTasks = async (userId: string, query: TaskQuery) => {
	try {
		console.log("Fetching tasks with params:", query);

		const daysPrev = subDays(dateNow, query?.daysPrev || 0);

		const tasksResponse = await db
			.select()
			.from(tasks)
			.where(
				and(
					eq(tasks.userId, userId),
					query.isDeleted ? undefined : isNull(tasks.deleted_at),
					query.isCompleted ? eq(tasks.isCompleted, query.isCompleted === "true" ? true : false) : undefined,
					query.daysPrev ? gt(tasks.created_at, daysPrev) : undefined
				),
			)
			.orderBy((t) => desc(query.isCompleted ? t.updated_at : t.created_at));

		return {
			tasks: tasksResponse,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao buscar tarefas", 500);
	}
};