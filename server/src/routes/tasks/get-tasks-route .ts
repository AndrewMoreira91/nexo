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
				params: z.object({
					daysPrev: z.number().min(0).optional(),
					isCompleted: z.boolean().optional(),
					isDeleted: z.boolean().optional(),
				}),
				response: {
					200: z.array(TaskSchema),
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { id: userId } = req.user;

			const params = req.params;

			const { tasks } = await getTasks(userId, params);

			reply.code(201).send(tasks);
		},
	);
};
