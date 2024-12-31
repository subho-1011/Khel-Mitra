import React from "react";

import { Button } from "@/components/ui/button";
import { OnlineTicTacToeGame, OfflineTicTacToeGame, OnlineTicTacToeProvider } from "@/components/tic-tac-toe";

import { useTicTacToeOptions } from "@/store/useTicTacToeOptions";

export default function TicTacToe() {
    const { gameMode, changeGameMode } = useTicTacToeOptions();

    React.useEffect(() => {
        return () => {
            changeGameMode(null);
        };
    }, [changeGameMode]);

    if (!gameMode) {
        return (
            <>
                <Button onClick={() => changeGameMode("Offline")}>
                    OFFLINE
                </Button>
                <Button onClick={() => changeGameMode("Online")}>
                    ONLINE
                </Button>
            </>
        );
    }

    if (gameMode === "Offline") {
        return <OfflineTicTacToeGame />;
    }

    if (gameMode === "Online") {
        return (
            <OnlineTicTacToeProvider>
                <OnlineTicTacToeGame />
            </OnlineTicTacToeProvider>
        );
    }

    return null;
}
