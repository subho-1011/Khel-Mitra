import { Namespace, Socket } from "socket.io";
import { Error, Response } from "../lib/response.js";
import { generateRoomId } from "../lib/genearte-room-id.js";
import { generateRandomUser, getUser } from "../lib/get-user.js";
import { ITicTacToeGame, TGameStatus, TTicTacToePlayer, TicTacToeSymbol } from "../types/index.js";

export class TicTacToeGame implements ITicTacToeGame {
    readonly id: string;
    io: Namespace;
    players: TTicTacToePlayer[];
    currentPlayer: TTicTacToePlayer | null;
    board: (TicTacToeSymbol | "")[];
    isGameOver: boolean;
    status: TGameStatus;
    winner: TTicTacToePlayer | null;
    winningCombinations?: readonly number[];
    maxPlayers: number;
    isDraw: boolean;
    isFriendly: boolean;

    constructor(io: Namespace) {
        this.id = generateRoomId();
        this.io = io;
        this.players = [];
        this.currentPlayer = null;
        this.board = Array(9).fill("");
        this.status = "Idle";
        this.isGameOver = false;
        this.winner = null;
        this.winningCombinations = [];
        this.maxPlayers = 2;
        this.isFriendly = false;
        this.isDraw = false;
    }

    addPlayer(socket: Socket, isFriendly: boolean) {
        if (this.maxPlayers === this.players.length) {
            socket.emit("error", new Error("Room is full"));
            return;
        }

        let user = getUser(socket);
        if (!user) user = generateRandomUser();

        socket.join(this.id);
        this.isFriendly = isFriendly;

        const newPlayer: TTicTacToePlayer = {
            ...user,
            socketId: socket.id,
            noOfWinnings: 0,
            symbol: this.randomSymbol(),
            isReady: true,
        };

        this.players = [...this.players, newPlayer];
        console.log("players :: ", this.players);

        if (this.players.length === this.maxPlayers) {
            console.log("maxPlayers :: " + this.maxPlayers);
            this.currentPlayer = this.players[0];
            this.status = "Waiting";
            this.broadcastRoomData();
        }

        // start game
        if (this.players.length === this.maxPlayers) {
            this.status = "Playing";
            this.broadcast("start", { room: this.roomData() }, "Game started. Waiting for players...");
        }
    }

    restartGame(playerId: string) {
        this.board = Array(9).fill("");
        this.isGameOver = false;
        this.winner = null;
        this.isDraw = false;
        this.status = "Waiting";
        this.winningCombinations = [];

        this.players.forEach((player) => {
            if (player.id === playerId) {
                player.isReady = true;
            }
        });

        // if both players are ready
        if (this.players.every((player) => player.isReady)) {
            this.status = "Playing";
            this.broadcast("start", { room: this.roomData() }, "Game restarted. Waiting for players...");
        }

        // this.broadcastRoomData();
    }

    move(position: number, playerId: string) {
        console.log(position, playerId);
        if (this.status !== "Playing") {
            return;
        }

        if (this.currentPlayer?.id !== playerId) {
            return;
        }

        if (this.board[position] !== "") {
            return;
        }

        this.board[position] = this.currentPlayer.symbol;
        this.checkWin();
        this.checkDraw();
        this.switchPlayer();
        this.broadcastRoomData();
    }

    disconnectPlayer(socket: Socket) {
        this.players = this.players.filter((p) => p.socketId === socket.id);
        this.io.to(this.id).emit("error", new Error("Your opponent has left"));

        this.dispose();
    }

    private dispose(): void {
        this.io.to(this.id).emit("shutdown");
        this.io.in(this.id).disconnectSockets(true);
    }

    private clearRoom(): void {
        this.players = [];
        this.board = [];
        this.currentPlayer = null;
        this.status = "Idle";
        this.currentPlayer = null;
        this.broadcastRoomData();
    }

    private switchPlayer() {
        const currentIndex = this.players.findIndex((p) => p.socketId === this.currentPlayer?.socketId);
        const nextIndex = (currentIndex + 1) % this.players.length;
        this.currentPlayer = this.players[nextIndex];
    }

    private checkDraw() {
        if (this.board.every((cell) => cell !== "")) {
            this.winner = null;
            this.isGameOver = true;
            this.isDraw = true;
            this.status = "Finished";
            this.players.forEach((player) => (player.isReady = !player.isReady));
            this.broadcastRoomData();
        }
    }

    private checkWin() {
        const winningPlayer = this.checkForWinning();
        if (!winningPlayer) return;

        this.winner = this.players.find((p) => p.symbol === winningPlayer.winnerSymbol) ?? null;
        this.winningCombinations = winningPlayer.winCombination;
        this.players.forEach((player) => {
            player.isReady = !player.isReady;

            if (player.socketId === this.winner?.socketId) {
                player.noOfWinnings++;
            }

            this.io.to(player.socketId).emit("win", new Response({ room: this.roomData(), winner: this.winner }));
        });
        this.isGameOver = true;
        this.status = "Finished";
        this.broadcastRoomData();
    }

    private checkForWinning(): {
        winnerSymbol: TicTacToeSymbol;
        winCombination: readonly number[];
    } | null {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ] as const;

        for (const combination of winningCombinations) {
            if (
                this.board[combination[0]] === this.board[combination[1]] &&
                this.board[combination[1]] === this.board[combination[2]] &&
                this.board[combination[0]] !== ""
            ) {
                const winnerSymbol = this.board[combination[0]] as TicTacToeSymbol;

                return { winnerSymbol, winCombination: combination };
            }
        }

        return null;
    }

    private randomSymbol(): TicTacToeSymbol {
        if (this.players.length === 0) {
            return Math.random() < 0.5 ? "X" : "O";
        }
        return this.players[0].symbol === "X" ? "O" : "X";
    }

    private broadcast(event: string, data: any, message?: string) {
        const response = new Response(data, message);
        this.io.to(this.id).emit(event, response);
    }

    private broadcastRoomData() {
        this.io.to(this.id).emit("roomData", new Response({ room: this.roomData() }));
    }

    sanitizeUser(player: TTicTacToePlayer) {
        return {
            id: player.id,
            name: player.name,
            avatar: player.avatar,
            symbol: player.symbol,
            noOfWinnings: player.noOfWinnings,
        };
    }

    private roomData() {
        return {
            roomId: this.id,
            players: this.players.map((player) => this.sanitizeUser(player)),
            currentPlayer: this.currentPlayer ? this.sanitizeUser(this.currentPlayer) : null,
            board: this.board,
            status: this.status,
            isGameOver: this.isGameOver,
            winner: this.winner ? this.sanitizeUser(this.winner) : null,
            winningCombinations: this.winningCombinations,
        };
    }
}
