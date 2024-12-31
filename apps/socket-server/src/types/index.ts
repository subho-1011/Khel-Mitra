import { Namespace } from "socket.io";

export interface IUser {
    id: string;
    name: string;
    avatar?: string;
}

export interface IPlayer extends IUser {
    socketId: string;
}

export const GameStatus = ["Idle", "Waiting", "Playing", "Finished"] as const;
export type TGameStatus = (typeof GameStatus)[number];

export type TicTacToeSymbol = "X" | "O";

export interface TTicTacToePlayer extends IPlayer {
    symbol: TicTacToeSymbol;
    noOfWinnings: number;
    isReady: boolean;
}

export interface ITicTacToeGame {
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
}
