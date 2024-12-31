import { cn } from "@/lib/utils";
import { TTicTacToePlayer } from "@/types";

export function DisplayPlayers({
    players,
    currentPlayerId,
    localPlayerId,
}: {
    players: TTicTacToePlayer[];
    currentPlayerId?: string;
    localPlayerId?: string;
}) {
    return (
        <div className="flex w-72 justify-between">
            {players.map((player, index) => (
                <div key={index} className="flex flex-col gap-1">
                    <div
                        className={cn(
                            "flex items-center gap-2 font-medium text-red-600",
                            player.id === localPlayerId && "text-emerald-500"
                        )}
                    >
                        <span className="text-lg">{player.name}</span>
                        <span>:</span>
                        <span>{player.noOfWinnings}</span>
                    </div>
                    <div
                        className={cn(
                            "w-0 h-1 transition-all duration-500 bg-primary/50 rounded-full",
                            player.id === currentPlayerId && "w-full"
                        )}
                    />
                </div>
            ))}
        </div>
    );
}
