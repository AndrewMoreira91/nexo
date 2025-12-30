import type { FastifyInstance } from "fastify";
import { loginRoute } from "./auth/login-route";
import { getDataProgressRoute } from "./datas/get-datas-progress-route";
import { getDataStatisticRoute } from "./datas/get-datas-statistic-route";
import { createSessionRoute } from "./sessions/create-session-route";
import { endSessionRoute } from "./sessions/end-session-route";
import { createTaskRoute } from "./tasks/create-task-route";
import { deleteTaskRoute } from "./tasks/delete-task-route";
import { getTasksRoute } from "./tasks/get-tasks-route ";
import { updateTaskRoute } from "./tasks/update-task-route";
import { getDateRoute } from "./tests/get-date-route";
import { createUserRoute } from "./user/create-user-route";
import { getUserRoute } from "./user/get-user-route";
import { updateUserRoute } from "./user/update-user-route";

export const routes = (app: FastifyInstance) => {
	app.register(loginRoute);

	app.register(getUserRoute);
	app.register(createUserRoute);
	app.register(updateUserRoute);

	app.register(endSessionRoute);
	app.register(createSessionRoute);

	app.register(getTasksRoute);
	app.register(createTaskRoute);
	app.register(updateTaskRoute);
	app.register(deleteTaskRoute);

	app.register(getDataProgressRoute);
	app.register(getDataStatisticRoute);

	app.register(getDateRoute);
};
