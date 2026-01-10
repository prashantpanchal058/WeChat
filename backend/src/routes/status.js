const express = require("express");
const router = express.Router();
const Status = require("../models/Status");
const fetch = require("../middleware/fetch");
const uploadStatus = require("../middleware/uploadStatus");

// CREATE STATUS (IMAGE / VIDEO)
router.post(
    "/upload",
    fetch,
    uploadStatus.single("status"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "File is required" });
            }

            const fileType = req.file.mimetype.startsWith("video")
                ? "video"
                : "image";

            const status = await Status.create({
                user: req.user.id,
                content: `/uploads/status/${req.file.filename}`,
                type: fileType,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            });

            res.status(201).json(status);
        } catch (error) {
            res.status(500).json({ error: "Server error" });
        }
    }
);

router.get("/feed", fetch, async (req, res) => {
    try {
        const statuses = await Status.find({
            expiresAt: { $gt: new Date() },
            user : { $ne: req.user.id }
        })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 });

        res.json(statuses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/seen/:id", fetch, async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);

        if (!status) {
            return res.status(404).json({ error: "Status not found" });
        }

        if (status.user.toString() === req.user.id) {
            return res.status(400).json({ error: "Cannot view your own status" });
        }

        await Status.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { seenBy: req.user.id } },
            { new: true }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/my", fetch, async (req, res) => {
    try {
        const myStatuses = await Status.find({
            user: req.user.id,
            expiresAt: { $gt: new Date() }
        }).populate("seenBy", "name avatar")
        .sort({ createdAt: -1 });

        const data = res.json(myStatuses);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.delete("/:id", fetch, async (req, res) => {
    try {
        const status = await Status.findById(req.params.id);

        if (!status) {
            return res.status(404).json({ error: "Status not found" });
        }

        if (status.user.toString() !== req.user.id) {
            return res.status(401).json({ error: "Not allowed" });
        }

        await Status.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
