import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";

export const errorHandler = (
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	if (error.validation) {
		for (const validationError of error.validation) {
			reply.status(400).send({
				statusCode: 400,
				error: "Bad Request",
				message: validationError.message,
			});
		}
	} else if (error instanceof CustomError) {
		reply.status(error.statusCode).send({
			statusCode: error.statusCode,
			error: error.name,
			message: error.message,
		});
	} else if (error instanceof jwt.JsonWebTokenError) {
		reply.status(401).send({
			statusCode: 401,
			error: "Unauthorized",
			message: "Token inválido ou expirado",
		});
	} else {
		console.error("Internal Server Error:", error);
		reply.status(500).send({
			statusCode: 500,
			error: "Internal Server Error",
			message: error.message,
		});
	}
};
