import express, { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

import chalk from "chalk";
import { PORT, CORS_ORIGINS } from "./config.js";
import { socketListener } from "./soket-listener.js";

const app: Express = express();

app.get("/health", (req: Request, res: Response) => {
    res.send("Khel mitra websocket server is running");
});

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: CORS_ORIGINS,
        methods: ["GET", "POST"],
    },
});

socketListener(io);

if (process.env.NODE_ENV !== "production") {
    server.listen(PORT, () => {
        console.log(chalk.magenta("Server is running port :: " + PORT));
    });
}
