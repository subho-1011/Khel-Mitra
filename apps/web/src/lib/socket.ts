import { io } from "socket.io-client";

// Socket server url
// ! TODO: Add environment variables
// const SOCKET_SERVER_URL = "http://localhost:8080";
const SOCKET_SERVER_URL = "http://192.168.0.102:8080";

// Create a socket client
export const socketClient = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    autoConnect: false,
});

// Create a socket client for the tic-tac-toe namespace
export const tttSocketClient = io(`${SOCKET_SERVER_URL}/tic-tac-toe`, {
    transports: ["websocket"],
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    autoConnect: false,
});
