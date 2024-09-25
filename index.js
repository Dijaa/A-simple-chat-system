const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening on *:${port}`);
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
        console.log("message: " + msg);
    });
});