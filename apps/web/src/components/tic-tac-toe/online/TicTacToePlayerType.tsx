import { Button } from "@/components/ui/button";
import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";
import React from "react";

export const TicTacToePlayerType = () => {
    const { playWithRandomPlayers } = useOnlineTicTacToeStore();

    const changeIsFriendly = (isFriendly: boolean) => useOnlineTicTacToeStore.setState({ isFriendly: isFriendly });

    return (
        <React.Fragment>
            <Button onClick={() => changeIsFriendly(true)}>
                Make It friendly
            </Button>
            <Button onClick={playWithRandomPlayers}>
                Make It Competitive
            </Button>
        </React.Fragment>
    );
};
