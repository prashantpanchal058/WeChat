const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");
const fetch = require("../middleware/fetch");
const multer = require('multer');
const dotenv = require("dotenv")
const path = require('path');
const fs = require("fs");

dotenv.config();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get all messages between two users
router.get("/:user1", fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const { user1 } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: userId },
                { sender: userId, receiver: user1 },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name _id")
            .populate("receiver", "name _id");

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Send a message
router.post("/send", fetch, upload.single('image'), async (req, res) => {
    try {
        const sender = req.user.id;
        const { receiver, content } = req.body;

        if (!sender || !receiver || (!content && !req.file))
            return res.status(400).json({ error: "sender, receiver, and content required" });

        const image = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const message = new Message({ sender, receiver, content, image });
        const savedMessage = await message.save();

        await savedMessage.populate("sender", "name _id");
        await savedMessage.populate("receiver", "name _id");

        res.json(savedMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
