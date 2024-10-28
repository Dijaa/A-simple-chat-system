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

    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`Usuário entrou na sala: ${room}`);

        socket.on("chat message", (data) => {
            io.to(data.room).emit("chat message", data.message);
            console.log(`Mensagem para ${data.room}: ${data.message}`);
        });

        socket.on("disconnect", () => {
            console.log("Usuário desconectado");
            socket.leave(room);
        });
    });
});
