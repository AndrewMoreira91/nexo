import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schemas/user-schema";
import { CustomError } from "../../errors/CustomError";
import { userDataResponse } from "./response-types";

export const findUserById = async (userId: string) => {
	try {
		const userResponse = await db
			.select(userDataResponse)
			.from(users)
			.where(eq(users.id, userId));

		if (userResponse.length === 0)
			throw new CustomError("Usuário não encontrado", 404);

		const user = userResponse[0];
		return user;
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao buscar usuário", 500);
	}
};
