const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});

io.on("connection", (socket) => {
    isFirstUser = true;
    if (isFirstUser) {
        socket.emit("first user", true);
        isFirstUser = false;

        socket.on("set preference", (preference) => {
            showUserName = preference;
        });
    }

    socket.on("chat message", (msg) => {
        if (!showUserName) {
            msg = msg.replace(/^[^:]+: /, ''); // Remove o nome do usuário
        }
        io.emit("chat message", msg);
        console.log("message: " + msg);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});