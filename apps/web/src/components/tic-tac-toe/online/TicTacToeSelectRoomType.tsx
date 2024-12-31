import React from "react";
import { Button } from "@/components/ui/button";

import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";

export const TicTacToeSelectRoomType = () => {
    const { setRoomType, createRoom } = useOnlineTicTacToeStore();

    return (
        <React.Fragment>
            <Button onClick={createRoom}>Create Room</Button>
            <Button onClick={() => setRoomType("join")}>Join Room</Button>
        </React.Fragment>
    );
};
