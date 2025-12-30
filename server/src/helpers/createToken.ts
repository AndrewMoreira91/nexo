import jwt from "jsonwebtoken";
import { env } from "../env";
import { isDevelopment } from "../utils/chose-environment";

export const createToken = (userId: string) => {
	const token = jwt.sign({ userId }, env.JWT_SECRET, {
		expiresIn: isDevelopment() ? "1d" : "30d",
	});
	return token;
};
