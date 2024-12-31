import { Server } from "socket.io";
import { createServer } from "node:http";

import chalk from "chalk";
import { PORT, CORS_ORIGINS } from "./config.js";
import { socketListener } from "./soket-listener.js";

const server = createServer();

export const io = new Server(server, {
    cors: {
        origin: CORS_ORIGINS,
        methods: ["GET", "POST"],
    },
});

socketListener(io);

server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(chalk.magenta("Server is running port :: " + PORT));
});
