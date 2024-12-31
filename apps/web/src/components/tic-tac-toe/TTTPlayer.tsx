import { cn } from "@/lib/utils";
import { TTicTacToePlayer } from "@/types";

export const TicTacToePlayer: React.FC<{ player?: TTicTacToePlayer; currentPlayer: TTicTacToePlayer }> = ({
    player,
    currentPlayer,
}) => {
    if (!player) return null;

    return (
        <div
            className={cn(
                "flex flex-col gap-1 p-4 border-2 w-fit rounded-md",
                player.id === currentPlayer?.id ? "bg-emerald-500" : "bg-rose-500"
            )}
        >
            <p>{player?.name}</p>
            <p>Symbol: {player?.symbol}</p>
            <p>No of Winnings: {player?.noOfWinnings}</p>
        </div>
    );
};
