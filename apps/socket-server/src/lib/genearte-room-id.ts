export function generateRoomId() {
    return (Math.floor(Math.random() * 100000) + 100000).toString();
}
