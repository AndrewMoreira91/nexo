import { subDays } from "date-fns";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";

type TaskQuery = {
	daysPrev?: number;
	isCompleted?: boolean;
	isDeleted?: boolean;
};

export const getTasks = async (userId: string, query?: TaskQuery) => {
	try {
		const defaultParams: TaskQuery = {
			daysPrev: 0,
			isCompleted: false,
			isDeleted: true,
			...query,
		};

		console.log("Fetching tasks with params:", defaultParams);

		const daysPrev = subDays(dateNow, defaultParams.daysPrev || 0);

		const tasksResponse = await db
			.select()
			.from(tasks)
			.where(
				and(
					eq(tasks.userId, userId),
					defaultParams.isDeleted ? undefined : isNull(tasks.deleted_at),
					defaultParams.isCompleted ? eq(tasks.isCompleted, true) : undefined,
					defaultParams.daysPrev ? gt(tasks.created_at, daysPrev) : undefined
				),
			)
			.orderBy((t) => desc(defaultParams.isCompleted ? t.updated_at : t.created_at));

		return {
			tasks: tasksResponse,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao buscar tarefas", 500);
	}
};