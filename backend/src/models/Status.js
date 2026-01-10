const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        content: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: ["text", "image", "video"],
            default: "text"
        },

        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

StatusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Status", StatusSchema);
