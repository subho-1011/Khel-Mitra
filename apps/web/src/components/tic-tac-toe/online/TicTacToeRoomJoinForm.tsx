import React from "react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";

export const TicTacToeRoomJoinForm = () => {
    const { joinRoom } = useOnlineTicTacToeStore();

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const joinRoomId = (event.target as HTMLFormElement).joinRoomId.value;
        if (!joinRoomId) {
            toast("Please enter a room ID");
            return;
        }

        joinRoom(joinRoomId);
    }

    return (
        <React.Fragment>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
                <Label htmlFor="joinRoomId">Join room</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        id="joinRoomId"
                        name="joinRoomId"
                        required
                        autoFocus
                        autoComplete="off"
                        className="w-40 p-2 rounded-lg"
                        placeholder="Enter Room id"
                    />
                    <Button type="submit" className="p-3 border-2 rounded-md w-fit">
                        Join Room
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Enter your friends room id here</p>
            </form>
        </React.Fragment>
    );
};
