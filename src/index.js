const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("../src/utils/messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

// co
io.on("connection", (socket) => {
  // he did with options instead {username,room}, and next line he use with sprad adduser({id:socket.id,...options})
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage(user.username, `Welcome ${user.username}!`));
    socket.broadcast.to(user.room).emit("message", generateMessage(user.username, `${user.username} has join`));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();

    // * socket.emit , io.emit , socket.broadcast.emit
    // * io.to.emit - emit event to anybody in spesific room
    // * socket.brodcast.to.emit - ssending event to anyone except to the spesicifc client in spesicif chatroom
  });

  socket.on("newMessage", (msg, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(msg)) {
      io.to(user.room).emit("message", generateMessage(user.username, "Profanity is not allowed"));
      return callback("Profanity is not allowed");
    }
    io.to(user.room).emit("message", generateMessage(user.username, msg));
    callback();
  });
  // ??????????????????????????????????????????????????
  socket.on("sendLocation", (coords, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    );
    cb();
  });

  socket.on("disconnect", () => {
    // console.log(getUsersInRoom(3));
    const user = removeUser(socket.id);
    // console.log(user);
    if (user) {
      // console.log(user.room);
      io.to(user.room).emit("message", generateMessage(user.username, `${user.username} has left.`));
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log("Server is live on port ", PORT);
});
