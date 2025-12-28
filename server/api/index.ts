import type { IncomingMessage, ServerResponse } from "http";
import app from "../src/app.js";

// Vercel serverless function handler
export default async function handler(req: IncomingMessage, res: ServerResponse) {
	await app.ready();
	app.server.emit("request", req, res);
}
