const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public2");
app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  socket.emit("message", "welcome to chat");

  socket.on("newMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(PORT, () => {
  console.log("Server is up on port ", PORT);
});
