import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { isDevelopment } from "../utils/chose-environment";


export const errorHandler = (
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	isDevelopment() && console.error("Error:", error);
	if (error.validation) {
		const errors = error.validation.map((validationError) => {
			return validationError.params.issue;
		});
		reply.status(422).send({
			statusCode: 422,
			error: "Unprocessable Entity",
			message: "Validation Error",
			errors,
		});
	} else if (error instanceof CustomError) {
		reply.status(error.statusCode).send({
			statusCode: error.statusCode,
			error: error.name,
			message: error.message,
		});
	} else if (error instanceof jwt.JsonWebTokenError) {
		reply.status(401).send({
			statusCode: 401,
			error: error.name,
			message: "Token inválido ou expirado",
		});
	} else {
		reply.status(500).send({
			statusCode: 500,
			error: "Internal Server Error",
			message: error.message,
		});
	}
};
