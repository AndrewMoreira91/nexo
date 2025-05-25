import { eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { db } from "../drizzle";
import { users } from "../drizzle/schemas/user-schema";
import { env } from "../env";
import { CustomError } from "../errors/CustomError";

export const verifyToken = async (
	req: FastifyRequest,
	reply: FastifyReply,
	done: () => void,
) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");
		if (!token) {
			throw new jwt.JsonWebTokenError("Não autorizado: Token ausente");
		}

		const { userId } = jwt.verify(token, env.JWT_SECRET) as { userId: string };

		const user = await db
			.select()
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (user.length === 0)
			throw new jwt.JsonWebTokenError("Não autorizado: Token inválido");

		req.user = user[0];
	} catch (error) {
		if (error instanceof CustomError) throw error;
		throw error;
	}
};
