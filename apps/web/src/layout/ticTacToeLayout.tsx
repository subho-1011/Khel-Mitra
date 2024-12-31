import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTicTacToeOptions } from "@/store/useTicTacToeOptions";

export function TicTacToeLayout({ children }: { children: React.ReactNode }) {
    const { changeGameMode, gameMode } = useTicTacToeOptions();

    return (
        <div className="container mx-auto space-y-6 w-full max-w-7xl">
            <div>
                <h1 className="text-2xl font-semibold tracking-wide text-center py-6">Tic Tac Toe</h1>
            </div>
            {gameMode && (
                <Button variant="outline" onClick={() => changeGameMode(null)}>
                    <ArrowLeft />
                </Button>
            )}
            <div className="flex flex-col w-full items-center justify-center gap-4">{children}</div>
        </div>
    );
}
