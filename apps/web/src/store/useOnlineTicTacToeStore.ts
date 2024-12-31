import { create } from "zustand";
import { ISocketResponse, TTicTacToePlayer, TicTacToeRoom } from "@/types";

import { toast } from "sonner";

import { tttSocketClient } from "@/lib/socket";

interface State {
    roomId: string;
    player: TTicTacToePlayer | null;
    room: TicTacToeRoom | null;
    isFriendly: boolean | null;
    roomType: "create" | "join" | null;
    isPlaying: boolean;
    isDraw: boolean;
    openGameOverModel: boolean;
}

interface Actions {
    setRoomId: (roomId: string) => void;
    setPlayer: (player: TTicTacToePlayer) => void;
    updateRoomData: (room: TicTacToeRoom) => void;
    setRoomType: (roomType: "create" | "join") => void;
    playWithRandomPlayers: () => void;
    createRoom: () => void;
    joinRoom: (joinRoomId: string) => void;
    restartGame: () => void;
    makeMove: (position: number) => void;
    resetRoom: () => void;
}

interface ITicTacToeStore extends Actions, State {}

export const useOnlineTicTacToeStore = create<ITicTacToeStore>((set, get) => ({
    roomId: "",
    player: null,
    room: null,
    isFriendly: null,
    roomType: null,
    isPlaying: false,
    isDraw: false,
    openGameOverModel: false,

    setRoomId: (roomId) => set({ roomId }),
    setPlayer: (player) => set({ player }),
    setRoomType: (roomType) => set({ roomType }),

    updateRoomData: (room) => {
        set({ room });

        if (room.winner) {
            setTimeout(() => set({ openGameOverModel: true }), 1000);
        }

        if (room.status === "Finished") {
            set({ isDraw: room.winner === null });
        }
    },

    playWithRandomPlayers: () => {
        set({ isFriendly: false });

        if (!tttSocketClient.connected) {
            tttSocketClient.connect();
        }

        tttSocketClient.emit("playWithRandomPlayers", {}, (data: ISocketResponse) => {
            if (data.success) {
                toast("Playing with random players");
                set({ roomId: data.data?.roomId, player: data.data?.player });
                localStorage.setItem("kmitra_tic_tac_toe_room_id", "true");
            } else {
                toast(data?.error || "Something went wrong");
            }
        });
    },

    createRoom: () => {
        set({ roomType: "create" });

        if (!tttSocketClient.connected) {
            tttSocketClient.connect();
        }

        tttSocketClient.emit("createRoom", {}, (data: ISocketResponse) => {
            if (data.success) {
                toast("Room created successfully");
                set({ roomId: data.data?.roomId, player: data.data?.player });
                localStorage.setItem("kmitra_tic_tac_toe_room_id", data.data?.roomId);
            } else {
                toast(data?.error || "Something went wrong");
            }
        });
    },

    joinRoom: (joinRoomId) => {
        set({ roomType: "join" });

        const haveLocalStorageRoom = localStorage.getItem("kmitra_tic_tac_toe_room_id");
        if (haveLocalStorageRoom) {
            toast("You already in a room");
            return;
        }

        if (!tttSocketClient.connected) {
            tttSocketClient.connect();
        }

        tttSocketClient.emit("joinRoom", { roomId: joinRoomId }, (data: ISocketResponse) => {
            if (data.success) {
                toast("Room joined successfully");
                set({ roomId: data.data.roomId, player: data.data.player });
                localStorage.setItem("kmitra_tic_tac_toe_room_id", data.data.roomId);
            } else {
                toast(data?.error || "Something went wrong");
            }
        });
    },

    restartGame: () => {
        if (!get().room || !get().player) return;

        set({ openGameOverModel: false, isDraw: false });

        tttSocketClient.emit(
            "restart",
            {
                roomId: get().roomId,
                playerId: get().player?.id,
            },
            (data: ISocketResponse) => {
                if (data.success) {
                    toast("Room restarted successfully");
                } else {
                    toast(data?.error || "Something went wrong");
                }
            }
        );
    },

    makeMove: (position) => {
        const { room, player } = get();

        if (room?.currentPlayer.id !== player?.id) {
            toast("It's not your turn");
            return;
        }

        tttSocketClient.emit(
            "makeMove",
            {
                roomId: get().roomId,
                currentPlayerId: get().player?.id,
                position,
            },
            (data: ISocketResponse) => {
                if (data.success) {
                    set({ room: data.data.room });
                } else {
                    toast(data?.error || "Something went wrong");
                }
            }
        );
    },

    resetRoom: () => {
        set({ roomId: "", player: null, room: null, isFriendly: null, roomType: undefined, isPlaying: false });
        const haveLocalStorageRoom = localStorage.getItem("kmitra_tic_tac_toe_room_id");
        if (haveLocalStorageRoom) {
            localStorage.removeItem("khelmitra_tic_tac_toe_room_id");
        }
    },
}));
