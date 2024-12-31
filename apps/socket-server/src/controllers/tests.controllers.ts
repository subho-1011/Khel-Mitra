import { Namespace } from "socket.io";

type User = {
    id: string;
};

// Every user when connect create rooms
const rooms = new Map<string, User[]>();

export function testsController(namespace: Namespace) {
    const commonRoom = "common";
    namespace.on("connect", (socket) => {
        console.log("Client connected", socket.id);

        socket.join(commonRoom);
        const users = rooms.get(commonRoom) || [];
        users.push({ id: socket.id });
        rooms.set(commonRoom, users);

        console.log(`Users in the common room: ${users.length}`);
        namespace.to(commonRoom).emit("welcome", `Welcome to the common room! Total users: ${users.length}`);

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);

            const users = rooms.get(commonRoom) || [];
            const updatedUsers = users.filter((user) => user.id !== socket.id);
            rooms.set(commonRoom, updatedUsers);

            console.log(`Remaining users in the room: ${updatedUsers.length}`);

            // Notify remaining clients
            namespace
                .to(commonRoom)
                .emit("user-disconnected", `A user has disconnected. Total users: ${updatedUsers.length}`);
        });

        socket.on("ping", () => {
            return socket.emit("pong");
        });
    });
}
