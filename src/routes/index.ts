import type { FastifyInstance } from 'fastify'
import { loginRoute } from './auth/login-route'
import { getDataProgressRoute } from './datas/get-datas-progress-route'
import { createSessionRoute } from './sessions/create-session-route'
import { endSessionRoute } from './sessions/end-session-route'
import { testeRoute } from './teste'
import { createUserRoute } from './user/create-user-route'
import { getTasksRoute } from './tasks/get-tasks-route '
import { createTaskRoute } from './tasks/create-task-route'
import { updateTaskRoute } from './tasks/update-task-route'

export const routes = (app: FastifyInstance) => {
	app.register(loginRoute)
	app.register(createUserRoute)

	app.register(endSessionRoute)
	app.register(createSessionRoute)

	app.register(getTasksRoute)
	app.register(createTaskRoute)
	app.register(updateTaskRoute)

	app.register(getDataProgressRoute)

	app.register(testeRoute)
}
