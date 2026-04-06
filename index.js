const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// ✅ Allowed origins (LOCAL + VERCEL)
const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-chatapp-xi.vercel.app",
  "https://prabhchat.vercel.app"
];

// ✅ Express CORS (FIXED)
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

// ✅ Socket.IO CORS (FIXED)
const io = new Server(server, {
  cors: {
    origin: "https://frontend-chatapp-xi.vercel.app" ,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Socket Connection
io.on("connection", (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  // Join Room
  socket.on("join_room", (data) => {
    socket.join(data.roomName);

    const message = `User Name: ${data.userName} joined room: ${data.roomName}`;
    console.log(message);

    io.to(data.roomName).emit("user_joined", message);
  });

  // Send Message with status tracking
  socket.on("send_message", (data) => {
    // Add a unique messageId if not provided
    const messageId = data.messageId || `${socket.id}-${Date.now()}`;
    const messageData = { ...data, messageId, status: "sent" };

    // Notify sender that message was sent
    socket.emit("message_sent", { messageId });

    // Send to room (including sender)
    io.to(data.roomName).emit("receive_message", messageData);
  });

  // Receiver acknowledges message was delivered
  socket.on("message_delivered", (data) => {
    // data: { messageId, roomName }
    io.to(data.roomName).emit("message_delivered", {
      messageId: data.messageId,
      status: "delivered",
    });
  });

  // Receiver has seen the message
  socket.on("message_seen", (data) => {
    // data: { messageId, roomName }
    io.to(data.roomName).emit("message_seen", {
      messageId: data.messageId,
      status: "seen",
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3001; // Default to 3001 if PORT is not set
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// ✅ PORT fix for Render
const PORT = process.env.PORT || 3001;




 
