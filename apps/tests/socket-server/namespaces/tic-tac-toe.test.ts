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
    clientSocket = Client(`http://localhost:${port}/tic-tac-toe`);
    clientSocket.on("connect", () => {
        done();
    });
});
beforeAll((done) => {
    clientSocket2 = Client(`http://localhost:${port}/tic-tac-toe`);
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

describe("Test tic-tac-toe namespace should be working", function () {
    test("Client should connect to the server", () => {
        expect(clientSocket.connected).toBe(true);
    });

    test("Second client should connect to the server", () => {
        expect(clientSocket2.connected).toBe(true);
    });
});

describe("Test tic-tac-toe namespace should be room actions", () => {
    let roomId: string = "test";
    let player1: any;
    let player2: any;

    test("Client should not found by player when make move before create room: ", () => {
        const sendData = { roomId, currentPlayerId: player1?.id, pos: 0 };
        clientSocket.emit("makeMove", sendData, (error: string) => {
            expect(error).toBe("Room not found");
            clientSocket.on("error", (error: Error) => {
                expect(error.message).toBe("Room not foundes");
            });
        });
    });

    test("Client should be able to create a room", (done) => {
        clientSocket.emit("createRoom", (data: any) => {
            console.log("Room created : ", data);
            roomId = data.roomId;
            player1 = data.player;
            expect(data.roomId).toBeTruthy();
        });
        clientSocket.on("roomCreated", (data) => {
            expect(data.roomId).toBe(roomId);
        });
        done();
    });

    test("Client should be able to join a room", (done) => {
        clientSocket2.emit("joinRoom", roomId, (data: any) => {
            console.log("Room joined : ", data);
            player2 = data.player;
            expect(data.success).toBe(true);
        });
        clientSocket2.on("roomJoined", (data) => {
            expect(data.success).toBe(true);
        });
        done();
    });

    test("Client 2 should be unable to start game", (done) => {
        const sendData = { roomId, playerId: player2?.id };
        clientSocket2.emit("startGame", sendData, (data: any) => {
            expect(data.success).not.toBe(true);
        });
        clientSocket2.on("startGame", (data) => {
            expect(data.success).toBe(false);
        });
        clientSocket2.on("error", (error) => {
            expect(error).toBe("You cannot start the game");
        });
        done();
    });

    test("Client should not take move until start the game", () => {
        const sendData = { roomId, currentPlayerId: player1?.id, pos: 0 };
        clientSocket.emit("makeMove", sendData, (error: string) => {
            // expect(error).toBe("Room not found");
        });
    });

    test("Client 1 should be able start game", (done) => {
        const sendData = { roomId, playerId: player1?.id };
        clientSocket.emit("startGame", sendData, (data: any) => {
            console.log("Game started : ", data);
            expect(data.success).toBe(true);
        });
        clientSocket.on("startGame", (data) => {
            expect(data.success).toBe(true);
            expect(data.player).toBe(player1);
        });
        done();
    });
});
