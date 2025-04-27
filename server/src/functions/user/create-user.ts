import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../drizzle";
import { users } from "../../drizzle/schemas/user-schema";
import { CustomError } from "../../errors/CustomError";
import { createToken } from "../../helpers/createToken";
import { userDataResponse } from "./response-types";

interface CreateUserProps {
	name: string;
	email: string;
	password: string;
}

export const createUser = async ({
	name,
	email,
	password,
}: CreateUserProps) => {
	try {
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email));

		if (existingUser.length > 0) {
			throw new CustomError("Usuário com este e-mail já criado", 409);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const user = await db
			.insert(users)
			.values({
				name,
				email,
				password: passwordHash,
			})
			.returning(userDataResponse);

		const accessToken = createToken(user[0].id);

		return {
			user: user[0],
			accessToken,
		};
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw new CustomError("Erro ao criar usuário", 500);
	}
};
