import express from 'express'
import "dotenv/config"
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import {Server} from 'socket.io'



// Express app and http server

const app =express()
const server = http.createServer(app)



export const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

export const userSocketMap = {}

io.on("connection", (socket) => {
  console.log("Handshake data:", socket.handshake.query);
  const userId = socket.handshake.query.userId;
  console.log("user Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});



//Middleware setup

app.use(express.json({limit: "4mb"}))
app.use(cors())

//Mongodb connection

await connectDB()

app.use("/api/status", (req,res)=> res.send("Server is live") )
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

const PORT  = process.env.PORT || 3000
server.listen(PORT, ()=> console.log("Server is running PORT:" + PORT)
)

