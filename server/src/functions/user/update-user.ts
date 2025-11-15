import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schemas/user-schema";
import { CustomError } from "../../errors/CustomError";
import { findUserById } from "./get-user";
import { userDataResponse } from "./response-types";

interface UpdateUserProps {
	userId: string;
	name?: string;
	email?: string;
	password?: string;
	streak?: number;
	longestStreak?: number;
	dailySessionTarget?: number;
	focusSessionDuration?: number;
	shortBreakSessionDuration?: number;
	longBreakSessionDuration?: number;
	completedOnboarding?: boolean;
	selectedDaysOfWeek?: number[];
}

export const updateUser = async (query: UpdateUserProps) => {
	try {
		await findUserById(query.userId);

		if (query.password) {
			query.password = await bcrypt.hash(query.password, 10);
		}

		const userUpdate = await db
			.update(users)
			.set({
				...query,
				updated_at: new Date(),
			})
			.where(eq(users.id, query.userId))
			.returning(userDataResponse);

		return { user: userUpdate[0] };
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao atualizar usuário", 500);
	}
};
