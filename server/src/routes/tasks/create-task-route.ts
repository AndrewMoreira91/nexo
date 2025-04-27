import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createTask } from "../../functions/tasks/create-task";
import { verifyToken } from "../../middlewares/verifyToken";
import { TaskSchema } from "../../zod/schemas";
import { taskTitleValidation } from "../../zod/validations";

export const createTaskRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/task",
		{
			schema: {
				summary: "Create a new task",
				tags: ["tasks"],
				body: z.object({
					title: taskTitleValidation,
				}),
				response: {
					201: TaskSchema,
				},
				security: [{ bearerAuth: [] }],
			},
			preHandler: verifyToken,
		},
		async (req, reply) => {
			const { title } = req.body;
			const { id: userId } = req.user;

			const { task } = await createTask({ title, userId });

			reply.code(201).send(task);
		},
	);
};
