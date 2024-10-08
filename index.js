const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://frontend-chatapp-xi.vercel.app" ,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

socket.on("join_room", (data) => {
    socket.join(data.roomName);
    // const message = `User with ID: ${socket.id} joined room: ${data.roomName}`;
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

const port = process.env.PORT || 3001; // Default to 3001 if PORT is not set
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





 