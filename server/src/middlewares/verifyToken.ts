import { eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { db } from "../drizzle";
import { users } from "../drizzle/schemas/user-schema";
import { env } from "../env";

export const verifyToken = async (
	req: FastifyRequest,
	reply: FastifyReply,
	done: () => void,
) => {
	const token = req.headers.authorization?.replace("Bearer ", "");
	if (!token) {
		return reply.code(401).send({ message: "Não autorizado: Token ausente" });
	}

	const { userId } = jwt.verify(token, env.JWT_SECRET) as { userId: string };

	const user = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (user.length === 0) {
		return reply.code(401).send({ message: "Não autorizado: Token inválido" });
	}

	req.user = user[0];
};
