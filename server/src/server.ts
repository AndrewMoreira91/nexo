import app from "./app";
import { env } from "./env";

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
	app.listen({ port: env.PORT, host: "0.0.0.0" }, (err, address) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}
		console.log(`Server listening at ${address}`);
	});
}

// Para Vercel (serverless)
export default async (req: any, res: any) => {
	await app.ready();
	app.server.emit('request', req, res);
};
