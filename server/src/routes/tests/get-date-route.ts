import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { dateNow } from "../../helpers/getDate";
import { verifyToken } from "../../middlewares/verifyToken";

export const getDateRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/date",
		{
			schema: {
				summary: "Get Date for test in frontend",
				tags: ["tests"],
				response: {
					201: z.object({
						date: z.date()
					}),
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken
		},
		async (_, reply) => {

			reply.code(201).send({ date: dateNow });
		},
	);
};
