import React from "react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";

export const TicTacToeCreateRoom = () => {
    const { roomId, setRoomId } = useOnlineTicTacToeStore();

    function copyRoomId() {
        if (!roomId) return;

        navigator.clipboard.writeText(roomId);
        toast("Room ID copied to clipboard");

        const roomIdInput = document.getElementById("roomId") as HTMLInputElement;
        if (roomIdInput) {
            roomIdInput.focus();
            roomIdInput.select();

            setTimeout(() => {
                roomIdInput.setSelectionRange(null, null);
                roomIdInput.blur();
            }, 2000);
        }
    }

    return (
        <React.Fragment>
            <div className="flex flex-col">
                <Label className="mb-2 text-start">Room ID</Label>
                <div className="flex gap-4">
                    <Input
                        type="text"
                        id="roomId"
                        name="roomId"
                        className={cn("max-w-xs", !roomId && "animate-pulse")}
                        placeholder="Enter Room id"
                        value={roomId}
                        onChange={() => setRoomId(roomId)}
                        readOnly
                    />
                    <Button onClick={copyRoomId} className="p-3 border-2 rounded-md w-fit">
                        Copy Room Id
                    </Button>
                </div>
            </div>
            <div>
                <p className="text-xs text-muted-foreground">
                    Click the button below to copy the room ID to your clipboard.
                </p>
                <p className="text-xs text-muted-foreground">You can share this link with others to join your game.</p>
            </div>
        </React.Fragment>
    );
};
