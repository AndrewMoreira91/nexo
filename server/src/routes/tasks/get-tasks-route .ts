import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getTasks } from "../../functions/tasks/get-tasks";
import { verifyToken } from "../../middlewares/verifyToken";
import { TaskSchema } from "../../zod/schemas";

export const getTasksRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/task",
		{
			schema: {
				summary: "Get all tasks for a user",
				tags: ["tasks"],
				response: {
					200: z.array(TaskSchema),
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { id: userId } = req.user;

			const { tasks } = await getTasks(userId);

			reply.code(201).send(tasks);
		},
	);
};
