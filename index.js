const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require('dotenv').config();

const app = express();

// Configure CORS for Express
app.use(cors({
  origin: process.env.CORS_ORIGIN, // Allow this origin
}));

const server = http.createServer(app);

// Create and configure Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.roomName);
    const message2 = `User Name: ${data.userName} joined room: ${data.roomName}`;
    console.log(message2);
    io.to(data.roomName).emit("user_joined", message2);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${process.env.PORT}`);
});
