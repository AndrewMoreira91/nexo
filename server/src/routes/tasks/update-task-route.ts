import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { updateTask } from "../../functions/tasks/update-task";
import { verifyToken } from "../../middlewares/verifyToken";
import { TaskSchema } from "../../zod/schemas";
import { taskTitleValidation } from "../../zod/validations";

export const updateTaskRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/task/:taskId",
		{
			schema: {
				summary: "Update a task",
				tags: ["tasks"],
				body: z.object({
					title: taskTitleValidation,
					isCompleted: z.boolean().optional(),
				}),
				params: z.object({
					taskId: z.string(),
				}),
				response: {
					201: TaskSchema,
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { title, isCompleted } = req.body;
			const { taskId: id } = req.params;
			const { id: userId } = req.user;

			const { task } = await updateTask({ id, title, isCompleted, userId });

			reply.code(201).send(task);
		},
	);
};
