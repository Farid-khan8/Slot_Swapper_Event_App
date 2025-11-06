const express = require("express");
const Event = require("../models/Event");
const SwapRequest = require("../models/SwapRequest");
const auth = require("../middleware/auth");

const router = express.Router();

// Get swappable slots from other users
router.get("/swappable-slots", auth, async (req, res) => {
    const slots = await Event.find({
        status: "SWAPPABLE",
        userId: { $ne: req.user.id },
    }).populate("userId", "name");
    res.json(slots);
});

// Get user's swap requests (incoming and outgoing)
router.get("/requests", auth, async (req, res) => {
    try {
        // Fetch incoming: Requests where the target slot belongs to the user
        const incomingRaw = await SwapRequest.find()
            .populate({
                path: "targetSlotId",
                match: { userId: req.user.id },
            })
            .populate("requesterSlotId");
        const incoming = incomingRaw.filter((req) => req.targetSlotId); // Filter out unmatched
        // Fetch outgoing: Requests where the requester slot belongs to the user
        const outgoingRaw = await SwapRequest.find()
            .populate({
                path: "requesterSlotId",
                match: { userId: req.user.id },
            })
            .populate("targetSlotId");
        const outgoing = outgoingRaw.filter((req) => req.requesterSlotId); // Filter out unmatched
        res.json({ incoming, outgoing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create swap request
router.post("/swap-request", auth, async (req, res) => {
    const { mySlotId, theirSlotId } = req.body;
    const mySlot = await Event.findOne({
        _id: mySlotId,
        userId: req.user.id,
        status: "SWAPPABLE",
    });
    const theirSlot = await Event.findOne({
        _id: theirSlotId,
        status: "SWAPPABLE",
    });
    if (!mySlot || !theirSlot)
        return res.status(400).json({ error: "Invalid slots" });

    const request = new SwapRequest({
        requesterSlotId: mySlotId,
        targetSlotId: theirSlotId,
    });
    await request.save();

    await Event.updateMany(
        { _id: { $in: [mySlotId, theirSlotId] } },
        { status: "SWAP_PENDING" }
    );
    res.status(201).json(request);
});

// Respond to swap request
router.post("/swap-response/:requestId", auth, async (req, res) => {
    const { accepted } = req.body;
    const request = await SwapRequest.findById(req.params.requestId).populate(
        "requesterSlotId targetSlotId"
    );
    if (!request) return res.status(404).json({ error: "Request not found" });

    const targetSlot = request.targetSlotId;
    if (targetSlot.userId.toString() !== req.user.id)
        return res.status(403).json({ error: "Unauthorized" });

    if (!accepted) {
        request.status = "REJECTED";
        await request.save();
        await Event.updateMany(
            {
                _id: {
                    $in: [
                        request.requesterSlotId._id,
                        request.targetSlotId._id,
                    ],
                },
            },
            { status: "SWAPPABLE" }
        );
        return res.json({ message: "Rejected" });
    }

    // Accept: Swap owners
    const tempUserId = request.requesterSlotId.userId;
    request.requesterSlotId.userId = request.targetSlotId.userId;
    request.targetSlotId.userId = tempUserId;
    request.status = "ACCEPTED";

    await request.requesterSlotId.save();
    await request.targetSlotId.save();
    await request.save();

    await Event.updateMany(
        {
            _id: {
                $in: [request.requesterSlotId._id, request.targetSlotId._id],
            },
        },
        { status: "BUSY" }
    );
    res.json({ message: "Accepted" });
});

// Get user's swap requests (incoming and outgoing)
router.get("/requests", auth, async (req, res) => {
    const incoming = await SwapRequest.find({
        "targetSlotId.userId": req.user.id,
    }).populate("requesterSlotId targetSlotId");
    const outgoing = await SwapRequest.find({
        "requesterSlotId.userId": req.user.id,
    }).populate("requesterSlotId targetSlotId");
    res.json({ incoming, outgoing });
});

module.exports = router;
