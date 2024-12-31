import * as uuid from "uuid";
import { Socket } from "socket.io";
import { IUser } from "../types/index.js";

export function generateRandomUser(): IUser {
    const id = uuid.v4().toString();
    const name = `user${id.substr(0, 5)}`;
    return { id, name };
}

export function getUser(socket: Socket): IUser | null {
    const authToken = socket.handshake.auth?.__authToken?.toString();
    if (!authToken) return null;
    // TODO: Implement user lookup using authToken

    return null; // Replace with actual user lookup logic
}
