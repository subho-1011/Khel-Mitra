import React from "react";
import { cn } from "@/lib/utils";
import { TicTacToeRoom, TTicTacToePlayer } from "@/types";

interface TicTacToeBoardProps {
    room: TicTacToeRoom;
    player: TTicTacToePlayer | null;
    roomType?: "create" | "join" | null;
    makeMove: (pos: number) => void;
    restartGame: () => void;
}

export const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ room, player, makeMove }) => {
    function isWinningCell(index: number): boolean {
        const winningCombination = room?.winningCombinations;
        if (!winningCombination) return false;

        return winningCombination.includes(index);
    }

    return (
        <div className="grid grid-cols-3 rounded-md w-fit">
            {room?.board.map((cell, index) => (
                <button
                    key={index}
                    className={cn("w-24 h-24 text-5xl border-4 rounded-md", {
                        "hover:bg-muted/20": room.status === "Playing",
                        "cursor-default": cell !== "",
                        "bg-emerald-500 shadow-lg": room.winner && isWinningCell(index),
                    })}
                    onClick={() => makeMove(index)}
                    disabled={
                        room?.status === "Finished" ||
                        !!room.winner ||
                        (cell !== "" && room.currentPlayer?.id !== player?.id)
                    }
                >
                    {cell}
                </button>
            ))}
        </div>
    );
};
