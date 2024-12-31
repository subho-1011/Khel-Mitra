import { Server } from "socket.io";
import { testsController } from "./controllers/tests.controllers.js";
import { ticTacToeController } from "./controllers/tic-tac-toe.controllers.js";

export function socketListener(io: Server) {
    const testsNamespace = io.of("/tests");
    testsController(testsNamespace);

    // tic tac toe
    const ticTacToeNamespace = io.of("/tic-tac-toe");
    ticTacToeController(ticTacToeNamespace);
}
