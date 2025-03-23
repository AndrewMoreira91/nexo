import app from './app'
import { env } from './env'
import { routes } from './routes'

routes(app)

app.listen({ port: env.PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
