import { subDays } from "date-fns";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "../../drizzle";
import { tasks } from "../../drizzle/schemas/tasks-schema";
import { CustomError } from "../../errors/CustomError";
import { dateNow } from "../../helpers/getDate";

type TaskParams = {
	daysPrev?: number;
	isCompleted?: boolean;
	isDeleted?: boolean;
};

export const getTasks = async (userId: string, params?: TaskParams) => {
	try {
		const defaultParams: TaskParams = {
			daysPrev: 0,
			isCompleted: false,
			isDeleted: true,
			...params,
		};

		const daysPrev = subDays(dateNow, defaultParams.daysPrev || 0);

		const tasksResponse = await db
			.select()
			.from(tasks)
			.where(
				and(
					eq(tasks.userId, userId),
					defaultParams.isDeleted ? undefined : isNull(tasks.deleted_at),
					defaultParams.isCompleted !== undefined
						? and(
							eq(tasks.isCompleted, defaultParams.isCompleted),
							gt(tasks.created_at, daysPrev)
						)
						: or(
							eq(tasks.isCompleted, false),
							gt(tasks.created_at, dateNow),
						),
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