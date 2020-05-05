const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const router = require("./router");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//run when there is a client connection
//socket is going to be connected with the client side
io.on("connection", (socket) => {
  console.log("We have a new connection!");

  //receive an event from the client side
  socket.on("join", ({ name, room }, callback) => {
    // console.log("name, room", name, room);

    //addUser() return either an error or a user
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    //system messages when user joins or leaves a room
    //emit a new event from the backend to the frontend
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the ${user.room} chatroom`,
    });

    //send message to all users beside that specific user
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    //join a user to a room
    socket.join(user, room);

    callback();
  });

  //event for user generated message
  //frontend emit event and backend waits for the event
  //message coming from the front end
  socket.on("sendMessage", (message, callback) => {
    //socket is from above io.on function parameter
    const user = getUser(socket.id);

    //specify the room name
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User had left!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
