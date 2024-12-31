import { AddressInfo } from "net";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";

import { io as Client, Socket } from "socket.io-client";
import { socketListener } from "../../socket-server/src/soket-listener.js";
import { beforeAll, afterAll } from "@jest/globals";

let io: Server;
let clientSocket: Socket;
let clientSocket2: Socket;
let httpServer: HttpServer;
let port: number;

// for server socket
beforeAll((done) => {
    // Create HTTP server
    httpServer = createServer();
    io = new Server(httpServer);

    // Setup socket server with handlers
    socketListener(io);

    // Start listening
    httpServer.listen(() => {
        port = (httpServer.address() as AddressInfo).port;
        done();
    });
});

afterAll((done) => {
    if (io) io.close();
    if (httpServer) httpServer.close();
    done();
});

beforeAll((done) => {
    clientSocket = Client(`http://localhost:${port}/tests`);
    clientSocket.on("connect", () => {
        done();
    });
});
beforeAll((done) => {
    clientSocket2 = Client(`http://localhost:${port}/tests`);
    clientSocket2.on("connect", () => {
        done();
    });
});

afterAll(function () {
    if (clientSocket) {
        clientSocket.disconnect();
        clientSocket.close();
    }
});
afterAll(function () {
    if (clientSocket2) {
        clientSocket2.disconnect();
        clientSocket2.close();
    }
});

export { io, httpServer, port, clientSocket, clientSocket2 };
