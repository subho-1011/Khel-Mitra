import { AddressInfo } from "net";
import { Server } from "socket.io";
import { createServer, Server as HttpServer } from "http";

import { io as Client, Socket } from "socket.io-client";
import { socketListener } from "../../../socket-server/src/soket-listener.js";
import { describe, test, beforeAll, afterAll } from "@jest/globals";

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

describe("Test namespace should be working", function () {
    test("Client should connect to the server", () => {
        expect(clientSocket.connected).toBe(true);
    });
});

describe("Second client socket should connect", () => {
    test("Client should connect to the server", () => {
        expect(clientSocket2.connected).toBe(true);
    });
});

describe("Test ping pong", function () {
    test("Test ping pong", (done) => {
        clientSocket.emit("ping");
        clientSocket.on("pong", () => {
            console.log("Received 'ping' from the server");
            expect(true).toBe(true);
            done();
        });
        clientSocket2.emit("ping");
        clientSocket2.on("ping", () => {
            console.log("Received 'ping' from the client2");
            expect(true).toBe(true);
            done();
        });
    });
});

describe("Test namespace should be working", function () {
    test("Broadcast welcome message to all clients", function (done) {
        let messageCount = 0;
        const expectedMessage = "Welcome to the common room!";

        function handleWelcome(message: string) {
            try {
                expect(message).toContain(expectedMessage);
                messageCount++;

                if (messageCount === 2) {
                    // Remove the listeners to prevent memory leaks
                    clientSocket.off("welcome", handleWelcome);
                    clientSocket2.off("welcome", handleWelcome);
                    done();
                }
            } catch (err: any) {
                done(err);
            }
        }

        // Set up listeners for both clients
        clientSocket.on("welcome", handleWelcome);
        clientSocket2.on("welcome", handleWelcome);

        // Reconnect both clients to trigger the welcome message
        clientSocket.disconnect().connect();
        clientSocket2.disconnect().connect();
    });
});

describe("Test disconnect", function () {
    test("Test disconnect", (done) => {
        expect(clientSocket.connected).not.toBe(false);
        clientSocket.on("disconnect", () => {
            expect(clientSocket.connected).toBe(false);
            done();
        });

        clientSocket.disconnect();
    });

    test("Test disconnect for second client", (done) => {
        expect(clientSocket2.connected).not.toBe(false);
        clientSocket2.on("disconnect", () => {
            expect(clientSocket2.connected).toBe(false);
            done();
        });

        clientSocket2.disconnect();
    });
});
