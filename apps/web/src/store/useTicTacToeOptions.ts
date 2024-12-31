import { create } from "zustand";

import { TGameMode } from "@/types";
import { tttSocketClient } from "@/lib/socket";
import { toast } from "sonner";

interface TicTacToeOptions {
    gameMode: TGameMode | null;
    changeGameMode: (mode: TGameMode | null) => void;
}

export const useTicTacToeOptions = create<TicTacToeOptions>((set) => ({
    gameMode: null,

    changeGameMode: (mode) => {
        console.log(mode);
        if (mode === "Online") {
            tttSocketClient.on("connect", () => {
                console.log("Tic tac toe client connected");
                toast("Connected to the game server");
            });

            tttSocketClient.on("connect_error", (error) => {
                console.error("Failed to connect to the game server", error);
                toast("Failed to connect to the game server");
            });
        }
        set({ gameMode: mode });
    },

    // Add more options as needed for different game modes. For example,
    // add a game difficulty level, or allow users to select their own game board size.

    // Example:
    // difficultyLevel: "easy",
    // setDifficultyLevel: (level) => set((state) => ({...state, difficultyLevel: level })),

    // Example:
    // boardSize: 3,
    // setBoardSize: (size) => set((state) => ({...state, boardSize: size })),

    // Example:
    // player1Name: "Player 1",
}));
