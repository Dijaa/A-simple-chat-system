// Servidor (server.js)
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

io.on("connection", (socket) => {
    console.log("Um usuário se conectou");

    socket.on('join room', ({ room, user }) => {
        socket.join(room);
        socket.username = user;
        socket.room = room;
        console.log(`${user} entrou na sala: ${room}`);
        io.to(room).emit('chat message', `${user} entrou na sala`);

        socket.on("chat message", (data) => {
            io.to(data.room).emit("chat message", data.message);
            console.log(`Mensagem para ${data.room}: ${data.message}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.username} desconectou`);
            io.to(socket.room).emit('chat message', `${socket.username} saiu da sala`);
            socket.leave(socket.room);
        });
    });
});
