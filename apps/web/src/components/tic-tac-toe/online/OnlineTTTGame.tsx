import React from "react";

import {
    TicTacToeBoard,
    TicTacToeCreateRoom,
    TicTacToeRoomJoinForm,
    TicTacToeSelectRoomType,
    TicTacToePlayerType,
} from "@/components/tic-tac-toe";
import { DisplayPlayers } from "../DisplayPlayers";

import { useOnlineTicTacToeStore } from "@/store/useOnlineTicTacToeStore";

export function OnlineTicTacToeGame() {
    const { isFriendly, isDraw, openGameOverModel, player, room, roomType, isPlaying, makeMove, restartGame } =
        useOnlineTicTacToeStore();

    if (isFriendly === null) {
        return <TicTacToePlayerType />;
    }

    if (!roomType && isFriendly) {
        return <TicTacToeSelectRoomType />;
    }

    if (roomType === "create" && isFriendly && !isPlaying) {
        return <TicTacToeCreateRoom />;
    }

    if (roomType === "join" && isFriendly && !isPlaying) {
        return <TicTacToeRoomJoinForm />;
    }

    console.log(isDraw);
    return (
        <React.Fragment>
            <ShowModel title="Game Over" open={openGameOverModel || isDraw}>
                {isDraw ? (
                    <p className="text-gray-500">It's a draw.</p>
                ) : (
                    <p className={`${room?.winner?.id === player?.id ? "text-emerald-500" : "text-red-500"}`}>
                        {room?.winner?.name} has won {room?.winner?.noOfWinnings} times.
                    </p>
                )}
                <Button onClick={restartGame}>Restart Game</Button>
            </ShowModel>
            {room && (isPlaying || room?.status === "Playing") && (
                <div className="flex flex-col w-full gap-6 items-center justify-center">
                    <DisplayPlayers
                        players={room.players}
                        currentPlayerId={room.currentPlayer.id}
                        localPlayerId={player?.id}
                    />
                    <TicTacToeBoard
                        room={room}
                        roomType={roomType}
                        player={player}
                        restartGame={restartGame}
                        makeMove={makeMove}
                    />
                    <div>
                        {player?.id === room?.currentPlayer.id && room.status === "Playing" && <p>It's your turn!</p>}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

interface ShowModelProps extends AlertDialogProps {
    triggerButtonString?: string;
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const ShowModel: React.FC<ShowModelProps> = ({
    open,
    onOpenChange,
    triggerButtonString,
    title,
    description,
    children,
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            {triggerButtonString && (
                <AlertDialogTrigger>
                    <button>Open Modal</button>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>{description}</AlertDialogDescription>
                {children}
                <AlertDialogFooter></AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
