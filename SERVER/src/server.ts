import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// 🛡️ Middleware to Verify JWT Token
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key_here");
        (socket as any).user = decoded; // Attach user to socket
        next();
    } catch (error) {
        next(new Error("Invalid token"));
    }
});

// 🗨️ Handle Private Messages
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${(socket as any).user.username}`);

    socket.on("privateMessage", ({ to, message }) => {
        io.to(to).emit("receiveMessage", { from: (socket as any).user.username, message });
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${(socket as any).user.username}`);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
