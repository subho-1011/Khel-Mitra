import { Socket } from "socket.io";
import { IPlayer } from "../types/index.js";
import { generateRandomUser, getUser } from "../lib/get-user.js";

export class Player implements IPlayer {
    socketId: string;
    id!: string;
    name!: string;
    avatar?: string;

    constructor(socket: Socket) {
        this.socketId = socket.id

        this.setUser(socket);
    }

    setUser(socket: Socket) {
        let user = getUser(socket);
        if (!user) user = generateRandomUser();

        this.id = user.id;
        this.name = user.name;
        this.avatar = user.avatar;
    }
}
