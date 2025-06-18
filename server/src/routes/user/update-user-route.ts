import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { updateUser } from "../../functions/user/update-user";
import { verifyToken } from "../../middlewares/verifyToken";
import { UserSchema } from "../../zod/schemas";
import {
	emailValidation,
	nameValidation,
	passwordValidation,
} from "../../zod/validations";

export const updateUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/user",
		{
			schema: {
				summary: "Update user",
				tags: ["users"],
				body: z.object({
					name: nameValidation.optional(),
					email: emailValidation.optional(),
					password: passwordValidation.optional(),
					dailySessionTarget: z.number().optional(),
					focusSessionDuration: z.number().optional(),
					shortBreakSessionDuration: z.number().optional(),
					longBreakSessionDuration: z.number().optional(),
					completedOnboarding: z.boolean().optional(),
					selectedDaysOfWeek: z
						.array(z.number().int().min(0).max(6))
						.optional(),
				}),
				response: {
					201: UserSchema,
				},
			},
			preHandler: verifyToken,
		},
		async (request, reply) => {
			const query = request.body;
			const { id: userId } = request.user;

			const { user } = await updateUser({
				userId,
				...query,
			});

			reply.code(201).send(user);
		},
	);
};
