import { Namespace } from "socket.io";
import { Error, Response } from "../lib/response.js";
import { TicTacToeGame } from "../classes/tic-tac-toe.class.js";

const rooms = new Map<string, TicTacToeGame>();

/**
 * This tic tac toe controller is responsible
 * @param namespace
 *
 * @description
 * This tic tac toe controller is responsible for creating and managing the Tic tac toe controller that will handle the events
 *
 * ! Working flow
 * 1. Create a new Tic tac toe controller for with your friends
 * 2. Connected the user
 * 2.1 Create new room - return { roomId: "123456" }
 * 2.2 Join the room by roomId - return response the user joined
 * 3. Admin can start the game and also remove the friend
 * 4. When starting the game - initiate the tic tac toe board and current player
 * 5. User moves to the board - send response to all players
 * 6. Same not moving repeatedly
 * 7. Check winner after every move
 * 7.1 If any one winner then send the winner
 * 7.2 If draw the game - can restart or leave the game
 * 7.3 Else change current player
 *
 * @returns {void} - No return value. This function initializes the Tic tac toe controller.
 */

// ----------------------------------------------------------------

export function ticTacToeController(namespace: Namespace): void {
    namespace.on("connect", function (socket) {
        console.log("Client connected with tic tac toe", socket.id);

        socket.on("createRoom", function (data, callback) {
            const room = new TicTacToeGame(namespace);
            rooms.set(room.id, room);
            room.addPlayer(socket, true);

            callback(new Response({ roomId: room.id, player: room.sanitizeUser(room.players[0]) }));
        });

        socket.on("joinRoom", function (data, callback) {
            const roomId = data.roomId;
            const room = rooms.get(roomId);
            if (!room) {
                callback(new Error("Room not found"));
                return;
            }

            room.addPlayer(socket, true);
            callback(new Response({ roomId, player: room.sanitizeUser(room.players[1]) }));
        });

        socket.on("playWithRandomPlayers", function (data, callback) {
            let room;
            room = Array.from(rooms.values()).find((room) => !room.isFriendly && room.players.length < room.maxPlayers);

            console.log(room);

            if (room) {
                room.addPlayer(socket, false);
                callback(new Response({ roomId: room.id, player: room.sanitizeUser(room.players[1]) }));
                return;
            }

            room = new TicTacToeGame(namespace);
            rooms.set(room.id, room);
            room.addPlayer(socket, false);
            callback(new Response({ roomId: room.id, player: room.sanitizeUser(room.players[0]) }));
        });

        socket.on("makeMove", function (data: { roomId: string; currentPlayerId: string; position: number }, callback) {
            console.log(data);
            const room = rooms.get(data.roomId);
            if (!room) {
                callback(new Error("Room not found"));
                return;
            }

            room.move(data.position, data.currentPlayerId);
        });

        socket.on(
            "restart",
            function (
                data: {
                    roomId: string;
                    playerId: string;
                },
                callback
            ) {
                const room = rooms.get(data.roomId);
                if (!room) {
                    callback(new Error("Room not found"));
                    return;
                }

                room.restartGame(data.playerId);
            }
        );

        socket.on("disconnect", () => {
            console.log("Client disconnected with tic tac toe", socket.id);

            let roomId;
            for (const [key, room] of rooms) {
                if (room.players.some((player) => player.socketId === socket.id)) {
                    roomId = key;
                    break;
                }
            }
            console.log(`Player with id: ${socket.id} has disconnected from room: ${roomId}`);

            if (roomId) {
                const room = rooms.get(roomId);
                room?.disconnectPlayer(socket);
                rooms.delete(roomId);
            }
            
            console.log("room size :: ", rooms.size);

            socket.disconnect();
        });
    });
}
