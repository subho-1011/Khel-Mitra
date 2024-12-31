import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.SOCKET_SERVER_PORT || 8080;

export const CORS_ORIGINS =
    !process.env.CORS_ORIGINS || process.env.CORS_ORIGINS === "*" ? "*" : process.env.CORS_ORIGINS.split(",");
