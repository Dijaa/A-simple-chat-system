const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.get("/chat.html", (req, res) => {
    res.sendFile(__dirname + "/public/chat.html");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

const rooms = {};

io.on("connection", (socket) => {
    console.log("Um usuário se conectou");

    socket.on('check room', (roomName) => {
        const exists = rooms.hasOwnProperty(roomName);
        if (exists) {
            const rules = rooms[roomName].rules;
            socket.emit('room exists', { exists: true, rules: rules });
        } else {
            socket.emit('room exists', { exists: false });
        }
    });

    socket.on('create room', ({ room, rules }) => {
        if (!rooms[room]) {
            rooms[room] = { rules: rules, users: [] };
            console.log(`Sala ${room} criada com as regras:`, rules);
        } else {
            socket.emit('error', 'A sala já existe.');
        }
    });

    socket.on('join room', ({ room, user }) => {
        if (!rooms[room]) {
            socket.emit('error', 'A sala não existe.');
            return;
        }

        const roomRules = rooms[room].rules;

        // Verificar se nickname é necessário
        if (roomRules.require_nickname && (!user || user.trim() === '')) {
            socket.emit('error', 'Esta sala requer um nickname.');
            return;
        }

        socket.join(room);
        socket.username = user || 'Anônimo';
        socket.room = room;
        rooms[room].users.push(socket.username);
        console.log(`${socket.username} entrou na sala: ${room}`);
        io.to(room).emit('chat message', `${socket.username} entrou na sala`);

        socket.on("chat message", (message) => {
            io.to(room).emit("chat message", `${socket.username}: ${message}`);
            console.log(`Mensagem para ${room}: ${message}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.username} desconectou`);
            io.to(room).emit('chat message', `${socket.username} saiu da sala`);
            socket.leave(room);
            // Remover usuário da sala
            rooms[room].users = rooms[room].users.filter(u => u !== socket.username);
            // Se a sala ficar vazia, remover a sala
            if (rooms[room].users.length === 0) {
                delete rooms[room];
                console.log(`Sala ${room} foi removida por estar vazia.`);
            }
        });
    });
});
