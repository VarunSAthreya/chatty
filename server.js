const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessages = require("./utils/messages");
const {
    addUser,
    getCurrentUser,
    removeUser,
    getAllUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const botName = "BOT";

io.on("connection", (socket) => {
    // Get user details on joining the chat
    socket.on("joinRoom", ({ username, room }) => {
        const user = addUser(socket.id, username, room);
        socket.join(user.room);

        // Welcome message
        socket.emit(
            "message",
            formatMessages(botName, `Welcome to the ${user.room} room`)
        );

        // Broadcast to all clients
        socket.broadcast
            .to(user.room)
            .emit(
                "message",
                formatMessages(botName, `${user.username} has joined the chat`)
            );

        // Send users and room details
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getAllUsersInRoom(user.room),
        });
    });

    // Listen for chat message
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessages(user.username, msg));
    });

    // On disconnect
    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit(
                "message",
                formatMessages(botName, `${user.username} has left the chat`)
            );
            // Send updated user list
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getAllUsersInRoom(user.room),
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
