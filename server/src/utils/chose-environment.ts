import { env } from "../env";

export const isDevelopment = () => env.ENVIRONMENT === "development";
export const isProduction = () => env.ENVIRONMENT === "production";