const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(5027, {
  cors: { origin: "*" },
});

const clients = {};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  clients[socket.id] = socket;

  // отправляем ID клиенту
  socket.emit("yourId", socket.id);

  // сигнализация WebRTC
  socket.on("signal", ({ to, data }) => {
    if (clients[to]) clients[to].emit("signal", { from: socket.id, data });
  });

  socket.on("disconnect", () => {
    delete clients[socket.id];
    console.log("Disconnected:", socket.id);
  });

  // можно добавить обработку callRejected и др.
});

server.listen(5029, () =>
  console.log("Server running on http://localhost:5029")
);
