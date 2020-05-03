const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const router = require("./router");

const PORT = process.env.PORT || 4000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

//run when there is a client connection
//socket is going to be connected with the client side
io.on("connection", (socket) => {
  console.log("We have a new connection!");

  socket.on("disconnect", () => {
    console.log("User had left!");
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
