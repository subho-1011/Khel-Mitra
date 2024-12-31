import { Server } from "socket.io";
import { createServer } from "node:http";

import chalk from "chalk";
import { PORT, CORS_ORIGINS } from "./config.js";
import { socketListener } from "./soket-listener.js";

const server = createServer();

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

socketListener(io);

server.listen(PORT, () => {
    console.log(chalk.magenta("Server is running port :: " + PORT));
});
