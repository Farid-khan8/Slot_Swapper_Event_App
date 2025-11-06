const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
    requesterSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    targetSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING",
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
