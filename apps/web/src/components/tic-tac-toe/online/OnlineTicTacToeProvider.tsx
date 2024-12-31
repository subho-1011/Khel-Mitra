import React from "react";
import { toast } from "sonner";
import { ISocketResponse } from "@/types";
import { tttSocketClient } from "@/lib/socket";

import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";

export function OnlineTicTacToeProvider({ children }: { children: React.ReactNode }) {
    const { resetRoom, updateRoomData } = useOnlineTicTacToeStore();
    // Listen for connect events
    React.useEffect(() => {
        tttSocketClient.on("connect", () => {
            console.log("Connected to the Tic Tac Toe server");
        });

        return () => {            
            tttSocketClient.on("disconnect", () => {
                console.log("Disconnected from the Tic Tac Toe server");
                tttSocketClient.disconnect();
                resetRoom();
                toast("You have been disconnected from the server");
            });
        };
    }, []);

    // Listen for room changes
    React.useEffect(() => {
        tttSocketClient.on("roomData", (data: ISocketResponse) => {
            if (data.error) {
                toast(data.error);
                return;
            }
            if (data.data.room) {
                updateRoomData(data.data.room);
            }
        });

        return () => {
            tttSocketClient.off("roomData");
        };
    }, [updateRoomData]);

    // Listen for game start
    React.useEffect(() => {
        tttSocketClient.on("start", (data: ISocketResponse) => {
            if (data.error) {
                toast(data.error);
                return;
            }

            useOnlineTicTacToeStore.setState({ isPlaying: true });
            console.log("Game started : ", data.data.room);
            updateRoomData(data.data.room);
        });

        return () => {
            tttSocketClient.off("start");
        };
    }, [updateRoomData]);

    // Listen for end
    React.useEffect(() => {
        tttSocketClient.on("shutdown", () => {
            resetRoom();
            toast("Game has ended");
        });

        return () => {
            tttSocketClient.off("shutdown");
        };
    }, [resetRoom]);

    // Listen for error
    React.useEffect(() => {
        tttSocketClient.on("error", (response) => {
            console.log(response);
            try {
                console.log(response);
                toast(response.error);
            } catch (error) {
                console.log(error);
                toast("An error occurred while connecting to the server");
            }
        });

        return () => {
            if (tttSocketClient.connected) {
                tttSocketClient.disconnect();
            }
        };
    }, []);

    // reset room data to default
    React.useEffect(() => {
        return () => resetRoom();
    }, []);

    return <>{children}</>;
}
