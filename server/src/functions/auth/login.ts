import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schemas/user-schema";
import { CustomError } from "../../errors/CustomError";
import { createToken } from "../../helpers/createToken";

interface LoginProps {
	email: string;
	password: string;
}

export const login = async ({ email, password }: LoginProps) => {
	try {
		const user = await db.select().from(users).where(eq(users.email, email));
		if (!user[0])
			throw new CustomError("Email ou senha inválidos", 401, "AuthError");
		if (user[0].deleted_at)
			throw new CustomError("Email ou senha inválidos", 401, "AuthError");

		const isPasswordValid = await bcrypt.compare(password, user[0].password);
		if (!isPasswordValid)
			throw new CustomError("Email ou senha inválidos", 401, "AuthError");

		const accessToken = createToken(user[0].id);

		return {
			user: {
				id: user[0].id,
				email: user[0].email,
				name: user[0].name,
				dailySessionTarget: user[0].dailySessionTarget,
				focusSessionDuration: user[0].focusSessionDuration,
				shortBreakSessionDuration: user[0].shortBreakSessionDuration,
				longBreakSessionDuration: user[0].longBreakSessionDuration,
				streak: user[0].streak,
				longestStreak: user[0].longestStreak,
				completedOnboarding: user[0].completedOnboarding,
				selectedDaysOfWeek: user[0].selectedDaysOfWeek,
				updated_at: user[0].updated_at,
				created_at: user[0].created_at,
				deleted_at: user[0].deleted_at,
			},
			accessToken,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao fazer login", 500);
	}
};
