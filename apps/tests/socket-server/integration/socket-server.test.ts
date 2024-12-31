import { AddressInfo } from "net";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";

import { io as Client, Socket } from "socket.io-client";
import { socketListener } from "../../../socket-server/src/soket-listener.js";
import { describe, it, beforeEach } from "@jest/globals";

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

// for client
beforeEach((done) => {
    clientSocket = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
        forceNew: true,
    });
    clientSocket.on("connect", () => {
        done();
    });
});

beforeEach((done) => {
    clientSocket2 = Client(`http://localhost:${port}`, {
        transports: ["websocket"],
        forceNew: true,
    });
    clientSocket2.on("connect", () => {
        done();
    });
});

afterEach(() => {
    if (clientSocket) {
        clientSocket.disconnect();
        clientSocket.close();
    }
    if (clientSocket2) {
        clientSocket2.disconnect();
        clientSocket2.close();
    }
});

describe("Socket Server Integration Tests", () => {
    it("should successfully connect to the socket server", (done) => {
        expect(clientSocket.connected).toBe(true);
        expect(clientSocket2.connected).toBe(true);
        done();
    });

    it("should handle disconnection", (done) => {
        // expect(clientSocket.connected).toBe(true);
        expect(clientSocket2.connected).toBe(true);

        clientSocket.on("disconnect", () => {
            expect(clientSocket.connected).toBe(false);
            expect(clientSocket2.disconnected).toBe(false);
            done();
        });

        clientSocket.disconnect();
        clientSocket2.disconnect();
    });
});

beforeEach(() => {});
