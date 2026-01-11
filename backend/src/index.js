const connectToMongo = require('./database');
const express = require("express");
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const __dirnameResolved = path.resolve();

// CORS
app.use(cors({
    origin: [process.env.FRONTEND_URL || "https://wechat-jnge.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(path.join(__dirnameResolved, 'uploads')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/message', require("./routes/message"));
app.use('/status', require("./routes/status"));

// Frontend build
app.use(express.static(path.join(__dirnameResolved, "frontend", "dist")));

app.get(/^(?!\/api).*/, (_, res) => {
    res.sendFile(
        path.join(__dirnameResolved, "frontend", "dist", "index.html")
    );
});

// START SERVER ONLY ONCE
(async () => {
    try {
        await connectToMongo();

        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        const io = require("socket.io")(server, {
            pingTimeout: 60000,
            cors: {
                origin: [process.env.FRONTEND_URL || "https://wechat-jnge.onrender.com"],
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
                credentials: true
            }
        });

        io.on("connection", (socket) => {

            socket.on("join", (userId) => {
                socket.join(userId);
            });

            socket.on("send_message", (msg) => {
                socket.to(msg.receiver._id).emit("receive_message", msg);
            });

            socket.on("typing", ({ sender, receiver }) => {
                socket.to(receiver).emit("typing", sender);
            });

            socket.on("stop_typing", ({ sender, receiver }) => {
                socket.to(receiver).emit("stop_typing", sender);
            });

            socket.on("disconnect", () => {});
        });

    } catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
})();
