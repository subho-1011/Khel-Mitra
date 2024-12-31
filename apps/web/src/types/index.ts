export interface IUser {
    id: string;
    name: string;
    avatar?: string;
}

export type TicTacToeSymbol = "X" | "O";

export const GameStatus = ["Idle", "Waiting", "Playing", "Finished"] as const;
export type TGameStatus = (typeof GameStatus)[number];

export type TGameMode = "Offline" | "Online";

export interface TTicTacToePlayer extends IUser {
    symbol: TicTacToeSymbol;
    noOfWinnings: number;
}

export interface TicTacToeRoom {
    roomId: string;
    players: TTicTacToePlayer[];
    currentPlayer: TTicTacToePlayer;
    board: string[];
    isGameOver: boolean;
    status: TGameStatus;
    winner: TTicTacToePlayer | null;
    winningCombinations?: readonly number[];
}

export interface ISocketResponse{
    success: boolean;
    message?: string;
    error?: string;
    data?: any;
}