const connectToMongo = require('./database');
const express = require("express");
var cors = require('cors');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const __dirnameResolved = path.resolve();

app.use(cors({
    origin: [ process.env.FRONTEND_URL || "https://wechat-jnge.onrender.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/auth', require('./routes/auth'))
app.use("/message", require("./routes/message"));
app.use("/status", require("./routes/status"))

app.use(express.static(path.join(__dirnameResolved, "frontend", "dist")));

app.get(/^(?!\/api).*/  , (_, res) => {
    res.sendFile(
        path.join(__dirnameResolved, "frontend", "dist", "index.html")
    );
});

const server = app.listen(port, () => {
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: [ process.env.FRONTEND_URL || "https://wechat-jnge.onrender.com"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true   // add this
    }
});

io.on("connection", (socket) => {

    // join personal room
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    // one-to-one messaging
    socket.on("send_message", (msg) => {
        socket.to(msg.receiver._id).emit("receive_message", msg);
    });

    // typing events
    socket.on("typing", ({ sender, receiver }) => {
        socket.to(receiver).emit("typing", sender);
    });

    socket.on("stop_typing", ({ sender, receiver }) => {
        socket.to(receiver).emit("stop_typing", sender);
    });

    socket.on("disconnect", () => {
    });
});

(async () => {
    try {
        await connectToMongo();
        server.listen(port, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Startup error:", err);
    }
})();
